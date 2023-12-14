const mongoose = require("mongoose");

const parcelSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, "please provide tracking number"],
    unique: true,
    min: [3, "tracking number cannot be less than 3 characters"],
    trim: true,
  },
  parcelCode: {
    type: String,
    unique: true,
    sparse: true,
    min: [3, "parcel code cannot be less than 3 characters"],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ["created", "arrived", "pickup"],
      message: "{VALUE} is not supported",
    },
    default: "created",
  },
  color: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    trim: true,
  },
  serviceCharge: {
    type: Number,
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
  },
});

module.exports = mongoose.model("Parcel", parcelSchema);
