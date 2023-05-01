const jimp = require("jimp");

const resizeFile = async (req, res, next) => {
  const { path: oldPathFile } = req.file;

  const image = await jimp.read(oldPathFile);

  await image.resize(250, 250);

  await image.writeAsync(oldPathFile);

  next();
};
module.exports = { resizeFile };