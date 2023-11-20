const cloudinary = require('cloudinary');
const path = require('path');

cloudinary.v2.config({
    cloud_name: 'dj3pynwbm',
    api_key: '386595838683476',
    api_secret: 'cOh-PBxfSGFWVJ0CghUZGQzpcKU'
});

exports.uploads = (file, folder) => {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(
            file.path,
            {
                resource_type: 'auto',
                folder: 'BookLib' + folder,
                public_id: path.parse(file.filename).name
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                }
                resolve(result.secure_url);
            }
        );
    });
};

exports.removeById = (public_id) => {
    cloudinary.v2.uploader.destroy(public_id);
};

exports.removeByUrl = (fileName, folder) => {
    if (!fileName) return;
    const image = fileName.substring(0, fileName.lastIndexOf('.'));
    cloudinary.v2.uploader.destroy('BookLib' + folder + image);
};