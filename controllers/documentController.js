const db = require('../utils/db');
const Document = db.Document;

const PDFParser = require('pdf-parse');
const { ObjectId } = require('mongodb');

const mammoth = require('mammoth');
const pdf = require('html-pdf');


exports.create = async (req, res) => {
    try {
        const file = req.file;
        const filename = file.originalname;
        const uploadStream = db.gfsBucket.openUploadStream(filename);
        uploadStream.end(file.buffer);
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });
        let format = '';

        const downloadStream = db.gfsBucket.openDownloadStream(uploadStream.id);
        let buffer = Buffer.alloc(0);

        buffer = await new Promise((resolve, reject) => {
            downloadStream.on('data', chunk => {
                buffer = Buffer.concat([buffer, chunk]);
            });

            downloadStream.on('end', () => {
                resolve(buffer);
            });

            downloadStream.on('error', (error) => {
                reject(error);
            });
        });
        let pages = 0;
        if (filename.endsWith('.pdf')) {
            format = 'pdf';
            pages = await extractPDFPages(buffer);

        }
        else if (filename.endsWith('.docx')) {
            format = 'docx';
            pages = await extractDocxPages(buffer);
        };
        console.log(pages);
        const document = new db.Document({
            name: decodeURIComponent(escape(filename)),
            status: "ready",
            fileId: uploadStream.id, // Save the GridFS file ID
            format: format,
            pages: pages,
            created_at: new Date(),
            updated_at: new Date()
        });
        document.save()
            .then(savedDocument => {
                res.status(200).json({
                    status: 'success',
                    message: 'Document was created successfully!',
                    data: savedDocument
                });
            })
            .catch(err => {
                res.status(500).json({ status: 'fail', message: err });
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
async function extractPDFPages(buffer) {
    const data = await PDFParser(buffer);
    return data.numpages;
}
async function extractDocxPages(docxBuffer) {
    const pdfBuffer = await convertDocxToPdf(docxBuffer);
    pages = await extractPDFPages(pdfBuffer);
    return pages;
}
async function convertDocxToPdf(docxBuffer) {
    const { value } = await mammoth.extractRawText({ buffer: docxBuffer });

    const html = `<html><head><meta charset="utf-8"></head><body>${value}</body></html>`;

    return new Promise((resolve, reject) => {
        pdf.create(html).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
}
exports.deleteById = (req, res) => {
    Document.deleteOne({ _id: req.query.docId })
        .then(result => {
            console.log('Document deleted in documents:', result);
            db.gfsBucket.delete(new ObjectId(req.query.fileId))
                .then(res => {
                    console.log('Deleted file in bucket.')
                });
            
        })
        .catch(error => {
            console.error('Error deleting document:', error);
        });
};
exports.download = (req, res) => {
    try {
        const fileId = req.params.fileId;

        // Tìm file trong GridFSBucket
        const downloadStream = db.gfsBucket.openDownloadStream(new ObjectId(fileId));
        db.gfsBucket.find({ _id: new ObjectId(fileId) }).toArray()
            .then(files => {
                if (!files || files.length === 0) {
                    return res.status(404).json({ error: 'File not found' });
                }

                const filename = decodeURIComponent(escape(files[0].filename));
                console.log(filename)
                // Đặt header để thông báo trình duyệt về loại tệp
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);

                // Truyền nội dung tệp về client
                downloadStream.pipe(res);
            })
            .catch(err => {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAll = (req, res) => {
    Document.find({ status: { $in: ['selected', 'ready'] } })
        .sort({ created_at: -1 })
        .then(documents => {
            res.status(200).send({ status: 'success', data: documents });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.getById = (req, res) => {
    Document.findById(req.params._id)
        .then(document => {
            res.status(200).send({ status: 'success', data: document });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.getSelected = (req, res) => {
    Document.find({ status: "selected" })
        .sort({ created_at: -1 })
        .then(documents => {
            res.status(200).send({ status: 'success', data: documents });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};
exports.updateById = (req, res) => {
    const id = req.params._id;
    const updateData = {
        name: req.body.name,
        pages: req.body.pages,
        format: req.body.format,
        status: req.body.status,
        updated_at: new Date()
    };
    Document.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedDocument => {
            if (!updatedDocument) {
                return res.status(404).send({ status: 'fail', message: 'Document not found' });
            }
            res.status(200).send({ status: 'success', data: updatedDocument });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};      