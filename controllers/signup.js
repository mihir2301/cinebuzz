const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const userdata = require('../models/user');
const otpmodel = require('../models/otpmodel');
const jwt = require('jsonwebtoken');
const sendgrid = require('nodemailer-sendgrid-transport');
const dotenv = require('dotenv/config');
const otpgenerator = require('otp-generator');
const user = require('../models/user');
const { result } = require('lodash');
const { validationResult } = require('express-validator');
const transport = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: process.env.API
    }
}))  
exports.signupreq = async(req , res ,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json('validation failed');
    }
    console.log(name);
    console.log(email);
    userdata.findOne({email:email}).then(result =>{
        if(result){
            console.log('already exist');
            res.statusCode = 301;
            return res.json('already exist');
        }
        const OTPgen = otpgenerator.generate(6 ,{
            digits:true , alphabets : false , uppercase:false,
            specialChars:false
        }); 
        otpmodel.findOne({email:email}).then(result =>{
            if(result===null){
                const otp = new otpmodel({
                    email:email,
                    otp:OTPgen
                });
                otp.save();
            }
            else{
                return otpmodel.findOneAndUpdate({email:email},{otp:OTPgen});
            }   
        })
        transport.sendMail({
            to:email,
            from:'kyabaathai21@gmail.com',  
            subject:'your OTP',
            html:`<h3> your otp is:  ${OTPgen} </h3>`
        })
        res.statusCode=201;
        console.log('otp send');
        res.json("otp send");
    }).catch(err=>{
        console.log(err);
        res.statusCode = 402;
    })
}
exports.otpreq = (req , res ,next)=>{
    const enteredotp = req.body.otp;
    console.log(enteredotp);
    otpmodel.findOne({email:req.body.email})
    .then(OTP=>{
        console.log(OTP.otp);
        if(enteredotp === OTP.otp ){
            res.statusCode = 201;
            console.log('otp verified');
            return res.json("otp verified");
        }
        else{
            res.statusCode = 401;
            console.log('otp verification failed');
            return res.json("verification failed");
        }
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.passreq = async(req ,res ,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;
    const confirmpass = req.body.confirmpass;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json('validation failed');
    }
    if(pass !== confirmpass){
        return res.json('password must be same!');
    }
    const hpass = await bcrypt.hash(pass ,10);
    const token = jwt.sign({email:email},process.env.TKN,{expiresIn:'7d'});
    const data = new userdata({
        name:name,
        email:email,
        pass:hpass
    })
    await data.save();
    userdata.findOne({email:email}).then(user=>{
        const userdetails = {
            id:user._id,
            name:name,
            email:email,
            token:token
        }
        res.statusCode = 201;
        console.log(userdetails)
        return res.json(userdetails);
    })
}
exports.Resetpassreq = async(req ,res ,next)=>{
    const email = req.body.email;
    const pass = req.body.pass;
    const confirmpass = req.body.confirmpass;
    if(pass !== confirmpass){
        res.statusCode = 301;
        return res.json('password must be same!');
    }
    const hpass = await bcrypt.hash(pass ,10);
    console.log('password set');
    const token = jwt.sign({email:email},process.env.TKN,{expiresIn:'7d'});
    return userdata.findOneAndUpdate({email:email},{pass:hpass}).then(user =>{
        const userdetails = {
            id:user._id,
            name:user.name,
            email:email,
            token:token
        }
        res.statusCode = 201;
        res.json(userdetails);
    })
}
exports.forgotreq = async(req , res ,next)=>{
    const email = req.body.email;
    console.log(email);
    userdata.findOne({email:email}).then(result =>{
        if(!result){
            console.log('email not exist');
            res.statusCode=401;
            return res.json('not exist');
        }
        const OTPgen = otpgenerator.generate(6 ,{
            digits:true , alphabets : false , uppercase:false,
            specialChars:false
        }); 
        otpmodel.findOne({email:email}).then(result =>{
            if(result===null){
                const otp = new otpmodel({
                    email:email,
                    otp:OTPgen
                });
                otp.save();
            }
            else{
                return otpmodel.findOneAndUpdate({email:email},{otp:OTPgen});
            }   
        })
        transport.sendMail({
            to:email,
            from:'kyabaathai21@gmail.com',  
            subject:'your OTP',
            html:`<h3> your otp is: ${OTPgen} </h3>`
        })
        res.statusCode=201;
        console.log('otp send');
        res.json("otp send");
    })
}
exports.changePassword = async(req,res,next)=>{
    const email = req.body.email;
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    userdata.findOne({email:email},async(err,user)=>{
        bcrypt.compare(oldPass,user.pass).then(async result=>{
            if(result){
                const hashpass = await bcrypt.hash(newPass ,10);
                user.pass = hashpass;
                user.save();
                res.statusCode =201;
                return res.json('password changed')
            }
            res.statusCode = 301;
            return res.json('incorrect password')
        })
    })
}