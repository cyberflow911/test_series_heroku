const multer = require('multer');

var maxSize = 1 * 1000 * 1000;
const FileStorageEngine= multer.diskStorage({
    destination: (req, file , cb) =>
    {
        cb(null, "public");
    },
    
    fileFilter: function(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb('File must be an image.');
        }
        cb(undefined, true);
    },
    filename: (req, file, cb)=>
    {
        cb(null, "images/"+Date.now() + "---" + file.originalname);
    }

})

const upload  = multer({storage: FileStorageEngine, limits: {fileSize: maxSize}});


module.exports = upload;