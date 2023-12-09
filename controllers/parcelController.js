const Parcel = require("../models/Parcel.js");
const { StatusCodes } = require("http-status-codes");
const Error = require("../errors");
const checkPermission = require("../utils/checkPermission.js");
const {
  sendCreatedEmail,
  sendArrivalEmail,
  sendPickupEmail,
} = require("../utils");

const createParcel = async (req, res) => {
  const data = { ...req.body, owner: req.user.userId };
  const parcel = await Parcel.create(data);

  await sendCreatedEmail({
    name: req.user.name,
    email: req.user.email,
    trackingNumber: parcel.trackingNumber,
  });
  res.status(StatusCodes.CREATED).json({ parcel });
};

const getAllParcels = async (req, res) => {
  const result = Parcel.find({}).populate("owner", "name email");

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const length = (await Parcel.find({})).length;
  const totalPages = Math.ceil(length / limit);
  const parcels = await result.skip(skip).limit(limit);

  res
    .status(StatusCodes.OK)
    .json({ parcels, count: length, meta: { page, totalPages } });
};

const getCurrentUserParcels = async (req, res) => {
  const {
    user: { userId },
  } = req;
  let result = Parcel.find({ owner: userId });

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const length = await (await Parcel.find({ owner: userId })).length;
  const totalPages = Math.ceil(length / limit);
  const parcels = await result.skip(skip).limit(limit);
  res
    .status(StatusCodes.OK)
    .json({ parcels, count: length, meta: { page, totalPages } });
};

const getSingleParcel = async (req, res) => {
  const {
    params: { id: parcelId },
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId });

  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }

  res.status(StatusCodes.OK).json({ parcel });
};

const getParcelByTrackingNumber = async (req, res) => {
  const {
    params: { id: trackingNumber },
  } = req;

  const parcel = await Parcel.findOne({ trackingNumber });
  if (!parcel) {
    throw new Error.NotFoundError(
      `No parcel with tracking number: ${trackingNumber}`
    );
  }

  res.status(StatusCodes.OK).json({ parcel });
};

const updateParcelArrived = async (req, res) => {
  const {
    params: { id: parcelId },
    user,
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId }).populate(
    "owner",
    "name email"
  );
  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }
  parcel.status = "arrived";
  parcel.arrivedAt = Date.now();
  await parcel.save();
  await sendArrivalEmail({
    name: parcel.owner.name,
    email: parcel.owner.email,
    trackingNumber: parcel.trackingNumber,
  });

  res.status(StatusCodes.OK).json({ parcel });
};
const updateParcelPickup = async (req, res) => {
  const {
    params: { id: parcelId },
    user,
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId }).populate(
    "owner",
    "name email"
  );
  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }

  parcel.status = "pickup";
  parcel.pickedUp = Date.now();
  await parcel.save();
  await sendPickupEmail({
    name: parcel.owner.name,
    email: parcel.owner.email,
    trackingNumber: parcel.trackingNumber,
  });

  res.status(StatusCodes.OK).json({ parcel });
};

const deleteParcel = async (req, res) => {
  const { id: parcelId } = req.params;

  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }

  await parcel.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "parcel removed" });
};

module.exports = {
  getSingleParcel,
  createParcel,
  getAllParcels,
  getCurrentUserParcels,
  updateParcelArrived,
  updateParcelPickup,
  deleteParcel,
  getParcelByTrackingNumber,
};
