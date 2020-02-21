const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let pathName = path.join(__dirname, '..', 'static', `${req.params.type}`);
    cb(null, pathName)
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
});
const upload = multer({
  storage: storage,

});
module.exports = upload;