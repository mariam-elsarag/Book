const express = require("express");
const router = express.Router();
const multer = require("multer");
// controller
const authController = require("../Controller/auth-controller");
const paymentController = require("../Controller/payment-controller");
const upload = multer();
router.post(
  "/checkout-session/:bookId",
  upload.none(),
  authController.protect,
  paymentController.getCheckoutSession
);
module.exports = router;
