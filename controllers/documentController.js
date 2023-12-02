const db = require('../utils/db');
const Document = db.Document;

const PDFParser = require('pdf-parse');
const { ObjectId } = require('mongodb');

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
        let pages = 0;

        if (filename.endsWith('.pdf')) {
            format = 'pdf';
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

            const data = await extractPDFPages(buffer);
            pages = data.numpages;
        }
        else if (filename.endsWith('.docx')) {
            format = 'docx';
        };
        const document = new db.Document({
            name: filename,
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
    return data;
}
exports.download = (req, res) => {
    try {
        const fileId = req.params.fileId;

        // Tìm file trong GridFSBucket
        const downloadStream = db.gfsBucket.openDownloadStream(new ObjectId(fileId));

        // Trả file về client
        downloadStream.pipe(res);
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
    Document.find({status: "selected"})
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

//exports.getAll = (req, res) => {
//  const ipp = parseInt(req.query.limit) || 15;
//  const curr = parseInt(req.query.page) || 0;
//  const orderBy = {};
//  if (req.query.orderBy) {
//    orderBy[req.query.orderBy] = req.query.orderBy === 'rating' ? -1 : 1;
//  } else {
//    orderBy['title'] = 1;
//  }
//  const query = {};
//  if (req.query.types) {
//    query['type_id'] = {
//      $in: req.query.types.split(','),
//    };
//  }
//  if (req.query.languages) {
//    query['language'] = {
//      $in: req.query.languages.split(','),
//    };
//  }
//  if (req.query.publishers) {
//    query['publisher'] = {
//      $in: req.query.publishers.split(','),
//    };
//  }
//  if (req.query.ratings) {
//    const minRating = Number(_min(req.query.ratings.split(',')));
//    query['rating'] = {
//      $gte: minRating,
//    };
//  }
//  Book.aggregate([
//    {
//      $lookup: {
//        from: 'comments',
//        localField: '_id',
//        foreignField: 'book_id',
//        as: 'comments',
//      },
//    },
//    {
//      $lookup: {
//        from: 'types',
//        localField: 'type_id',
//        foreignField: 'id',
//        as: 'types',
//      },
//    },
//    {
//      $addFields: {
//        rating_amount: { $size: '$comments' },
//        sum_stars: { $sum: '$comments.stars' },
//        rating: {
//          $cond: [
//            { $eq: [{ $size: '$comments' }, 0] },
//            0,
//            { $divide: [{ $sum: '$comments.stars' }, { $size: '$comments' }] },
//          ],
//        },
//      },
//    },
//    {
//      $match: query,
//    },
//    {
//      $project: {
//        comments: 0,
//        sum_stars: 0,
//      },
//    },
//    {
//      $sort: orderBy,
//    },
//    {
//      $facet: {
//        metadata: [{ $count: 'totalRecords' }],
//        books: [{ $skip: curr * ipp }, { $limit: ipp }],
//      },
//    },
//  ]).exec((err, data) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }

//    res.status(200).send({
//      status: 'success',
//      data: data[0],
//    });
//  });
//};
//exports.getAllBook = (req, res) => {
//  Book.find(
//    {
//      $query: {},
//      $orderby: {id: 1, title: 1}
//    }
//  ).exec((err, data) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }

//    res.status(200).send({
//      status: 'success',
//      data: data[0],
//    });
//  });
//};
//exports.getGood = (req, res) => {
//  const ipp = parseInt(req.query.limit) || 5;
//  const curr = parseInt(req.query.page) || 0;
//  Book.aggregate([
//    {
//      $lookup: {
//        from: 'comments',
//        localField: '_id',
//        foreignField: 'book_id',
//        as: 'comments',
//      },
//    },
//    {
//      $lookup: {
//        from: 'types',
//        localField: 'type_id',
//        foreignField: 'id',
//        as: 'types',
//      },
//    },
//    {
//      $addFields: {
//        rating_amount: { $size: '$comments' },
//        sum_stars: { $sum: '$comments.stars' },
//        rating: {
//          $cond: [
//            { $eq: [{ $size: '$comments' }, 0] },
//            0,
//            { $divide: [{ $sum: '$comments.stars' }, { $size: '$comments' }] },
//          ],
//        },
//      },
//    },
//    {
//      $project: {
//        comments: 0,
//        sum_stars: 0,
//      },
//    },
//    {
//      $sort: {
//        rating: -1,
//      },
//    },
//  ])
//    .skip(curr * ipp)
//    .limit(ipp)
//    .exec((err, books) => {
//      if (err) {
//        res.status(500).send({ status: 'fail', message: err });
//        return;
//      }

//      res.status(200).send({
//        status: 'success',
//        data: books,
//      });
//    });
//};

//exports.getById = (req, res) => {
//  Book.findOne({id: req.params.id}).exec((err, book) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    if (!book) {
//      res.status(404).send({ status: 'fail', message: 'Book not found' });
//      return;
//    }
//    Comment.find({ book_id: book._id }).exec((err, comments) => {
//      if (err) {
//        res.status(500).send({ status: 'fail', message: err });
//        return;
//      }
//      let sum_stars = 0;
//      for (let i = 0; i < comments.length; i++) {
//        sum_stars += comments[i].stars;
//      }
//      res.status(200).send({
//        status: 'success',
//        data: Object.assign(book.toObject(), {
//          rating_amount: comments.length,
//          rating: sum_stars / comments.length,
//        }),
//      });
//    });
//  });
//};

//exports.searchByName = (req, res) => {
//  const ipp = parseInt(req.query.limit) || 10;
//  const curr = parseInt(req.query.page) || 0;
//  Book.aggregate([
//    {
//      $search: {
//        index: 'title_author_publisher',
//        phrase: {
//          query: req.body.keyword,
//          path: ['title', 'author', 'publisher'],
//        },
//        count: {
//          type: "total"
//        }
//      },
//    },
//    {
//      $skip: ipp * curr
//    },
//    {
//      $limit: ipp
//    }
//  ])
//  .exec((err, books) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    if (!books) {
//      res.status(200).send({
//        status: 'success',
//        data: null,
//      });
//      return;
//    }
//    return res.status(200).send({
//      status: 'success',
//      data: books,
//    });
//  });
//};

//exports.getByType = (req, res) => {
//  Book.find({ type_id: req.params.type_id }).exec((err, book) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      data: book,
//    });
//  });
//};

//exports.addType = (req, res) => {
//  const type = new Type({
//    id: req.body.id,
//    name: req.body.name,
//  });
//  type.save((err, type) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res
//      .status(200)
//      .send({ status: 'success', message: 'Type was created successfully!' });
//  });
//};

//exports.removeType = (req, res) => {
//  Type.aggregate([
//    { $match: { _id: { $eq: new ObjectID(req.params.id) } } },
//    {
//      $lookup: {
//        from: 'books',
//        localField: 'id',
//        foreignField: 'type_id',
//        as: 'books',
//      },
//    },
//    {
//      $addFields: {
//        books_amount: { $size: '$books' },
//      },
//    },
//    {
//      $project: {
//        books: 0,
//      },
//    },
//  ]).exec((err, types) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    if (types[0].books_amount > 0) {
//      res.status(200).send({
//        status: 'fail',
//        message: "Can't delete a type contains books!",
//      });
//      return;
//    }
//    Type.remove({ _id: req.params.id }).exec((err) => {
//      if (err) {
//        res.status(500).send({ status: 'fail', message: err });
//        return;
//      }
//      res.status(200).send({
//        status: 'success',
//        message: 'Type was deleted',
//      });
//    });
//  });
//};

//exports.addPublisher = (req, res) => {
//  const publisher = new Publisher({
//    id: req.body.id,
//    name: req.body.name,
//  });
//  publisher.save((err, publisher) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Publisher was created successfully!',
//    });
//  });
//};

//exports.getAllPublishers = (req, res) => {
//  Publisher.find({}).exec((err, publishers) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({ status: 'success', data: publishers });
//  });
//};

//exports.addLanguage = (req, res) => {
//  const language = new Language({
//    id: req.body.id,
//    name: req.body.name,
//  });
//  language.save((err, language) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Language was created successfully!',
//    });
//  });
//};

//exports.getAllLanguages = (req, res) => {
//  Language.find({}).exec((err, languages) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({ status: 'success', data: languages });
//  });
//};

//exports.getAllTypes = (req, res) => {
//  Type.aggregate([
//    {
//      $lookup: {
//        from: 'books',
//        localField: 'id',
//        foreignField: 'type_id',
//        as: 'books',
//      },
//    },
//    {
//      $addFields: {
//        books_amount: { $size: '$books' },
//      },
//    },
//    {
//      $project: {
//        books: 0,
//      },
//    },
//  ]).exec((err, types) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({ status: 'success', data: types });
//  });
//};

//exports.comment = (req, res) => {
//  const comment = new Comment({
//    user_id: req.userId,
//    book_id: req.body.id,
//    content: req.body.content,
//    stars: req.body.stars,
//  });
//  comment.save((err, comment) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Comment was created successfully!',
//      data: comment,
//    });
//  });
//};

//exports.getAllComments = (req, res) => {
//  Comment.aggregate([
//    { $match: { book_id: { $eq: new ObjectID(req.params.id) } } },
//    {
//      $lookup: {
//        from: 'users',
//        localField: 'user_id',
//        foreignField: '_id',
//        as: 'detailUsers',
//      },
//    },
//    { $unwind: '$detailUsers' },
//    {
//      $project: {
//        'detailUsers.password': 0,
//        'detailUsers.username': 0,
//        'detailUsers.address': 0,
//        'detailUsers.birth': 0,
//        'detailUsers.phone': 0,
//      },
//    },
//    {
//      $sort: { updated_at: -1 }
//    }
//  ]).exec((err, comments) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }

//    res.status(200).send({
//      status: 'success',
//      data: comments,
//    });
//  });
//};

//exports.delete = (req, res) => {
//  Book.remove({ _id: req.params.id }).exec((err) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Book was deleted',
//    });
//  });
//};
