const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

router.use(validateToken);
router.route("/").get(getContacts).get(getContact).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
