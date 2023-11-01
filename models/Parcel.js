const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide parcel name"],
    min: [3, "please provide parcel name more than 3 characters"],
  },
  status: {
    type: String,
    enum: {
      values: ["created", "arrived", "pickup"],
      message: "{VALUE} is not supported",
    },
    default: "created",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  arrivedAt: {
    type: Date,
  },
  pickedUp: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please provide owner"],
  },
});

module.exports = mongoose.model("Parcel", parcelSchema);
