const path = require("path");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// upload with express fileupload
const uploadProductImage = async (req, res) => {
  // if user submit form without uploading image
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  const productImage = req.files.image;

  // if user tries to upload non-image files
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("please upload an image");
  }
  // if user upload img more than specific kilobytes
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "please upload an image smaller than 1MB"
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  // mv() - move files elsewhere where we want, returns promise or callback
  await productImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({
    image: {
      src: `/uploads/${productImage.name}`,
    },
  });
};

// upload with cloudinary
const uploadProductImage2 = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    // 1. path, temp path where files goes
    req.files.image.tempFilePath,
    // 2.options
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  // remove temp files on server
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage,
  uploadProductImage2,
};
