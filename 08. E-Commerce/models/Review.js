const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      required: [true, "Please provide title"],
      trim: true,
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide text"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// if we have multiple fields which are unique fields, we use index method
// now one user can leave review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// static methods - we are calling it only in schema
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log("save called");
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log("remove called");
});

module.exports = mongoose.model("Review", ReviewSchema);
