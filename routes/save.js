const router = require('express').Router();
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const movieModel =  require('../models/moviesmodel')
const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req ,file ,cb)=>{
        cb(null ,'video')
    },
    filename: (req,file ,cb)=>{
        cb(null ,file.originalname);
    }
});
let upload = multer({storage:storage});
router.post('/upload',upload.single('video'),function(req,res,next){
    const fileinfo = req.file;
    const movie = new movieModel({
        section:req.body.section,
        name:req.body.name,
        poster:fileinfo.path,
        genre:req.body.genre,
        creater:req.body.creater,
        plot:req.body.plot,
    });
    movie.save();
    res.json('asdasdasd');
    console.log(movie);
});
router.put('/upload_video',upload.single('video'),async function(req,res,next){
    const fileinfo = req.file;
    const name = req.body.name;
    const result = await movieModel.findOne({name:name});
    result.video = fileinfo.path;
    result.save();
    res.json('video saved');
});
module.exports = router