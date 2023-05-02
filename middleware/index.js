const { authenticate } = require("./authenticate");
const { upload } = require("./upload");
const { resizeFile } = require("./jimp");

module.exports = {
  authenticate,
  upload,
  resizeFile,
};