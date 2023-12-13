const express = require("express");
const router = express.Router();
const {
  getSingleParcel,
  getParcelsByDate,
  createParcel,
  getAllParcels,
  getParcelByTrackingNumber,
  getCurrentUserParcels,
  updateParcelArrived,
  updateParcelPickup,
  deleteParcel,
} = require("../controllers/parcelController.js");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication.js");

router.get("/", authenticateUser, authorizePermissions("admin"), getAllParcels);
router.get("/getCurrentUserParcels", authenticateUser, getCurrentUserParcels);
router.get(
  "/getParcelsByDate",
  authenticateUser,
  authorizePermissions("admin"),
  getParcelsByDate
);
router.post("/", authenticateUser, createParcel);
router.get("/:id", getSingleParcel);
router.get("/trackingNumber/:id", getParcelByTrackingNumber);
router.patch(
  "/updateParcelArrived/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateParcelArrived
);
router.patch(
  "/updateParcelPickup/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateParcelPickup
);
router.delete("/:id", authenticateUser, deleteParcel);

module.exports = router;
