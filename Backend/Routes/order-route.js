const express = require("express");
const multer = require("multer");
const router = express.Router();

// controller
const authController = require("../Controller/auth-controller");
const orderController = require("../Controller/order-controller");

// multer
const upload = multer();

router.use(authController.protect);

router.route("/").get(orderController.getOrders);
router
  .route("/:id")
  .get(authController.restrectTo("admin"), orderController.getOrder)
  .delete(authController.restrectTo("admin"), orderController.deleteOrder)
  .patch(
    authController.restrectTo("admin"),
    upload.none(),
    orderController.updateOrder
  );

module.exports = router;
