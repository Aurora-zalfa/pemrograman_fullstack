const distribusiModel = require("../models/distribusiModel");

exports.updateStatus = (req, res)=>{
  const id = req.params.id;
  const status = req.body.status;

  distribusiModel.updateStatus(id, status, (err, result)=>{
    if(err){
      res.status(500).json(err);
    }else{
      res.json({
        message: "Status berhasil diupdate"
      });
    }
  });
};