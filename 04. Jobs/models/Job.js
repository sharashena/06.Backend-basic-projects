const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 50,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      // connect user which is logged in
      type: mongoose.Types.ObjectId,
      // ref - which model we want connect
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  // timestamps creates key value pairs, created at time and updated at time automatically
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
