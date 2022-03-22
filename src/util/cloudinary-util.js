const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary-config');

const uploadPhoto = (folderName, photo) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: folderName,
    },
    (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );

  streamifier.createReadStream(photo).pipe(uploadStream);
});

const deletePhoto = async (publicId) => {
  cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadPhoto, deletePhoto };
