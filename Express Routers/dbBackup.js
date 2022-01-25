const express = require('express');
const router = express.Router();
const BKP = require('mongodb-snapshot');
const db = process.env.DB;
var backup = require('mongodb-backup');
 
async function mongoSnap(path, restore = false) {
    const mongo_connector = new BKP.MongoDBDuplexConnector({
        connection: { uri: 'mongodb+srv://sidharth:ishugudda@cluster0.rqjlm.mongodb.net', dbname: 'noqueue' }
    });
    const localfile_connector = new BKP.LocalFileSystemDuplexConnector({
        connection: { path: path },
         noCursorTimeout: false
    });
    const transferer = restore ? 
        new BKP.MongoTransferer({ source: localfile_connector, targets: [mongo_connector] }) : 
        new BKP.MongoTransferer({ source: mongo_connector, targets: [localfile_connector] }) ;
    for await (const { total, write } of transferer) { }
}

router.get("/backup", async(req, res)=>{
    try
    {
        await mongoSnap('./backups/collections.tar'); // backup
        res.status(200).json({
            status: true,
            message: "backup successful",
            
        });
    

    }catch (err)
    {
        res.status(400).json({
            status: false,
            message: "error while creating backup reason "+reason,
            
        });
    }
    
})

router.get("/restore", async(req, res)=>{
    await mongoSnap('../backups/collections.tar',true); // backup
})

module.exports = router;