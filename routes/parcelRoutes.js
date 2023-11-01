const express = require("express");
const router = express.Router();
const {
  getSingleParcel,
  createParcel,
  getAllParcels,
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
router.post("/", createParcel);
router.get("/:id", authenticateUser, getSingleParcel);
router.patch("/updateParcelArrived/:id", authenticateUser, updateParcelArrived);
router.patch("/updateParcelPickup/:id", authenticateUser, updateParcelPickup);
router.delete("/:id", authenticateUser, deleteParcel);

module.exports = router;
