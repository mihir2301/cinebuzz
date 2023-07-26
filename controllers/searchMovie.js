const movieModel = require('../models/moviesmodel');
exports.search =async(req ,res ,next)=>{
    console.log(req.body.name);
    movieModel.find({name:{$regex:req.body.name,$options: "i"}},'name',(err,item)=>{
        if(err){
            res.json(err);
            console.log(err);
        }
        else{
            res.json(item)
            console.log(item);
        }
    }).sort({item:1});
} 
