const router = require('express').Router();
const multer = require('multer'); 


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      callback(null, 'uploads')
    },
    filename: function (req, file, cb) {
      callback(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage });

  router.post('/uploadfile', upload.single('myfile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        console.log('No File Received');
        return res.send({
            success : false
        });
    }
     else{
         const image = req.file;
         console.log('File Received');
         return res.send({
          success : true,
           image : image
            });
        }
   
  });
  
  module.exports = router;