const express = require("express");
const userController = require("./../controllers/userController");

const router = express.Router();

// CRUD routes for user
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
