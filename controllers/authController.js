const authModel = require("../models/authModel");

exports.register = (req, res) => {
  const data = req.body;

  authModel.register(data, (err, result)=>{
    if(err){
      res.status(500).json(err);
    }else{
      res.json({
        message: "User berhasil register",
        result: result
      });
    }
  });
};

exports.login = (req, res) => {
  const data = req.body;

  authModel.login(data, (err, result)=>{
    if(err){
      res.status(500).json(err);
    }else{
      if(result.length > 0){

        const user = result[0];
        delete user.password;

        res.json({
          message: "Login berhasil",
          user: user
        });

      }else{
        res.json({
          message: "Username atau password salah"
        });
      }
    }
  });
};