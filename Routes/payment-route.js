const express = require("express");
const router = express.Router();
const multer = require("multer");
// controller
const authController = require("../Controller/auth-controller");
const paymentController = require("../Controller/payment-controller");

const upload = multer();
router
  .route("/checkout-session/:bookId")
  .post(
    upload.none(),
    authController.protect,
    paymentController.getCheckoutSession
  );
router
  .route("/success-payment")
  .post(
    upload.none(),
    authController.protect,
    paymentController.successPayment
  );
module.exports = router;
