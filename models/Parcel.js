const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, "please provide tracking number"],
    unique: true,
    min: [3, "tracking number cannot be less than 3 characters"],
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
