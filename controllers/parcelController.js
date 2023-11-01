const Parcel = require("../models/Parcel.js");
const { StatusCodes } = require("http-status-codes");
const Error = require("../errors");
const checkPermission = require("../utils/checkPermission.js");

const createParcel = async (req, res) => {
  const parcel = await Parcel.create(req.body);
  res.status(StatusCodes.CREATED).json({ parcel });
};

const getAllParcels = async (req, res) => {
  const parcels = await Parcel.find({}).populate("owner", "name email");
  res.status(StatusCodes.OK).json({ parcels, count: parcels.length });
};

const getCurrentUserParcels = async (req, res) => {
  const {
    user: { userId },
  } = req;
  const parcels = await Parcel.find({ owner: userId });
  res.status(StatusCodes.OK).json({ parcels, count: parcels.length });
};

const getSingleParcel = async (req, res) => {
  const {
    params: { id: parcelId },
    user,
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId });

  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }

  // check if the user accessses his own parcel
  checkPermission(user, parcel.owner.toString());
  res.status(StatusCodes.OK).json({ parcel });
};

const updateParcelArrived = async (req, res) => {
  const {
    params: { id: parcelId },
    user,
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }

  // check if the user accessses his own parcel
  checkPermission(user, parcel.owner.toString());

  parcel.status = "arrived";
  parcel.arrivedAt = Date.now();
  await parcel.save();

  res.status(StatusCodes.OK).json({ parcel });
};
const updateParcelPickup = async (req, res) => {
  const {
    params: { id: parcelId },
    user,
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId });
  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }

  // check if the user accessses his own parcel
  checkPermission(user, parcel.owner.toString());

  parcel.status = "pickup";
  parcel.pickedUp = Date.now();
  await parcel.save();

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
};
