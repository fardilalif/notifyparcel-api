const Parcel = require("../models/Parcel.js");
const { StatusCodes } = require("http-status-codes");
const Error = require("../errors");
const checkPermission = require("../utils/checkPermission.js");
const { sendArrivalEmail, sendPickupEmail } = require("../utils");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");

const createParcel = async (req, res) => {
  const data = {
    ...req.body,
    owner: req.user.role === "admin" ? null : req.user.userId,
  };
  const parcel = await Parcel.create(data);

  res.status(StatusCodes.CREATED).json({ parcel });
};

const getAllParcels = async (req, res) => {
  const result = Parcel.find({}).populate("owner", "name studentNumber");

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const parcels = await Parcel.find({}).populate("owner", "name studentNumber");
  const length = parcels.length;
  const totalPages = Math.ceil(length / limit) || 1;
  const parcelsPage = await result.skip(skip).limit(limit);

  res
    .status(StatusCodes.OK)
    .json({ parcels, parcelsPage, count: length, meta: { page, totalPages } });
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

  const parcels = await Parcel.find({ owner: userId });
  const length = parcels.length;
  const totalPages = Math.ceil(length / limit) || 1;
  const parcelsPage = await result.skip(skip).limit(limit);
  res
    .status(StatusCodes.OK)
    .json({ parcels, parcelsPage, count: length, meta: { page, totalPages } });
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

const getParcelsArrivalByDate = async (req, res) => {
  const {
    query: { date },
  } = req;

  const parcels = await Parcel.find({
    arrivedAt: {
      $lte: endOfDay(new Date(date)),
      $gte: startOfDay(new Date(date)),
    },
  }).populate("owner", "name studentNumber");

  if (!parcels) {
    throw new Error.NotFoundError(
      `No parcel with tracking number: ${trackingNumber}`
    );
  }

  res.status(StatusCodes.OK).json({ parcels });
};

const getParcelsPickupByDate = async (req, res) => {
  const {
    query: { date },
  } = req;

  const parcels = await Parcel.find({
    pickedUp: {
      $lte: endOfDay(new Date(date)),
      $gte: startOfDay(new Date(date)),
    },
  }).populate("owner", "name studentNumber");

  if (!parcels) {
    throw new Error.NotFoundError(
      `No parcel with tracking number: ${trackingNumber}`
    );
  }

  res.status(StatusCodes.OK).json({ parcels });
};

const updateParcelArrived = async (req, res) => {
  const {
    params: { id: parcelId },
    body: { parcelCode, color, size, serviceCharge },
  } = req;

  const parcel = await Parcel.findOne({ _id: parcelId }).populate(
    "owner",
    "name email"
  );
  if (!parcel) {
    throw new Error.NotFoundError(`No parcel with id: ${parcelId}`);
  }
  parcel.parcelCode = parcelCode;
  parcel.color = color;
  parcel.size = size;
  parcel.serviceCharge = serviceCharge;
  parcel.status = "arrived";
  parcel.arrivedAt = Date.now();
  await parcel.save();

  parcel?.owner?.email &&
    (await sendArrivalEmail({
      name: parcel.owner.name,
      email: parcel.owner.email,
      trackingNumber: parcel.trackingNumber,
      parcelCode,
      color,
      size,
    }));

  res.status(StatusCodes.OK).json({ parcel });
};
const updateParcelPickup = async (req, res) => {
  const {
    params: { id: parcelId },
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

  parcel?.owner?.email &&
    (await sendPickupEmail({
      name: parcel.owner.name,
      email: parcel.owner.email,
      parcelCode: parcel.parcelCode,
      color: parcel.color,
      size: parcel.size,
      trackingNumber: parcel.trackingNumber,
    }));

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
  getParcelsArrivalByDate,
  getParcelsPickupByDate,
};
