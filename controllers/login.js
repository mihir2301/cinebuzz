const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userloginmodel = require('../models/user');
exports.loginReq = async(req , res , next)=>{ 
    const email = req.body.email;
    const pass = req.body.pass;
    const token = jwt.sign({email:email},process.env.TKN,{expiresIn:'7d'});
    userloginmodel.findOne({email:email}).then(user =>{
        if(!user){
            res.statusCode = 401;
            return res.json('no account exist');
        }
        bcrypt.compare(pass,user.pass).then(result=>{
            if(result){
                res.statusCode = 201;
                const userdetails = {
                    id:user._id,
                    name:user.name,
                    email:email,
                    token:token,
                    dpUrl:user.dpUrl
                }
                return res.json(userdetails);
            }
            res.statusCode = 301;
            res.json('incorrect pass');
        })  
        .catch(err=>{
            console.log(err);
        })
    })
}
