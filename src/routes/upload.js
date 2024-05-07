const router = require('express').Router();
const multer = require('multer'); 


const storage = multer.diskStorage({
    destination : function(req,file,callback){
        callback(null,__dirname+'../../my-images');
    },
    filename : function(req,file,callback){
        callback(null,Date.now()+'-'+file.originalname);
    }
});
  var upload = multer({ storage: storage });

  router.post('/uploadfile', upload.single('myfile'), (req, res) => {
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
  module.exports = router