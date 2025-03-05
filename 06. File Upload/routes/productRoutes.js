const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
} = require("../controllers/productController");
const { uploadProductImage, uploadProductImage2 } = require("../controllers/uploadsController");

router.route("/").post(createProduct).get(getAllProduct);
router.route("/uploads").post(uploadProductImage2);

module.exports = router;
