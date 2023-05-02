const express = require("express");
const router = express.Router();

const { authenticate, upload, resizeFile } = require("../../middlewares");

const ctrl = require("../../controllers");

router.post("/register", ctrl.userRegister);

router.post("/login", ctrl.userLogin);

router.post("/logout", authenticate, ctrl.userLogout);

router.get("/current", authenticate, ctrl.userCurrent);

router.patch("/", authenticate, ctrl.userUpdateSubscription);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  resizeFile,
  ctrl.userUpdateAvatar
);

module.exports = router;