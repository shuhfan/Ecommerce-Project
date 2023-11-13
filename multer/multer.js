const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/assets/imgs/category');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'));
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter })

module.exports = upload