const express = require("express");
const router = express.Router();

const {
  userDetails,authenticateToken,fileuploader,upload
} = require("../../controllers/userController/userDetailsController");

router.post("/userDetails", authenticateToken,upload.array('uploaded_file',4),userDetails);
// router.post("/fileuploader",upload.array('uploaded_file',3),fileuploader);


module.exports = router;