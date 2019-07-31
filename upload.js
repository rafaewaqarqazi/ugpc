const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = `./uploads/${req.params.type}`;
        console.log(path);
        cb(null,path)
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // only pdf files accepted //
        if (!file.originalname.match(/\.pdf$/)) {
            return cb(new Error('Only csv files are allowed!'), false);
        }
        else{
            cb(null, true);
        }
    } ,
    limits: { fileSize: 1000000 }
});
module.exports = upload;