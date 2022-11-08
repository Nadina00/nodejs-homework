const multer = require("multer");
const path = require("path");
const temDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, temDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
 

});
const uploadMidleware = multer({
  storage: multerConfig,
});

module.exports = {
  uploadMidleware,
};
