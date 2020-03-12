const multer = require('multer');

// cho phép lưu ở đâu , đặt tên file, và xử lí hàm
const storage = multer.diskStorage({
   destination: (req, file, cd) => cd(null, './public'),
   filename: (req, file, cb) => cb(null, Date.now() + file.originalname)


});

// giới hạn kích thước file
const limits = { fileSize: 10240000 };
// dest : chỉ cho phép lưu ở đâu
// const upload = multer({ dest: './public' });


function fileFilter(req, file, cb) {
   const { mimetype } = file;
   if (mimetype === 'image/png' || mimetype === "'image/jpeg'") {
      return cb(null, true);
   }
   cb(new Error('file khong hợp lệ'));
}

// chỉ truyền đươc 4 cái 
const upload = multer({ storage, limits, fileFilter });

module.exports = upload;