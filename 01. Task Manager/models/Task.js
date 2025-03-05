const mongoose = require("mongoose");

// if we try to add some key value which properties don't exist it will be ignored  in schema
// what key value pairs will be in schema only they will transfered to database
const TaskSchema = new mongoose.Schema({
  // name: String,
  // completed: Boolean,

  // with validations
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [20, "name can't be more than 20 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// mongoose.model(1.name of collection (automaticaly set to lowercase and plurar), schema)
module.exports = mongoose.model("Task", TaskSchema);
