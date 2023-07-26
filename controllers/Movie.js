const { size, sortBy, result } = require('lodash');
const { findOne } = require('../models/moviesmodel');
const movieModel = require('../models/moviesmodel');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const transport = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: process.env.API
    }
})) 

const user = require('../models/user');
exports.trendingsection = async(req ,res ,next)=>{
    let a = [];
    movieModel.find({},'poster name views').then(item=>{
        for(let i=0 ; i < 10 ; i++){
            a.push(item[i]);
        }
        console.log(a);
        res.json(a);
    }).catch(err=>{
        console.log(err);
        res.json(err);
        res.statusCode = 404;
    }).sort({"views":-1});
}

exports.actionsection = async(req ,res ,next)=>{
    const genre = req.query.genre;
    console.log(genre)
    movieModel.find({genre:genre},'poster name',(err ,item)=>{
        if(err){
            console.log(err);
            res.statusCode =404;
        }
        else{
            console.log(item);
            res.json(item);
        }
    })
}
exports.onemovie = async(req ,res , next)=>{
    const _id = req.body._id;
    movieModel.findOne({_id:_id},'name poster video genre creater plot')
    .then(item=>{
        if(!item){
            res.statusCode = 404;
            res.json('no movie exist');
        }
        else{
            res.statusCode = 201;
            console.log(item);
            res.json(item);
        }
    }).catch(err=>{
        console.log(err);
        res.statusCode = 404;
        res.json(err);
    })
}
exports.onemovieRatingshow=async(req,res,next)=>{
    movieModel.find({_id:req.body.Movieid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            if(!item){
                res.statusCode = 404;
                res.json('No movie found');
            }
            else{
                let sum = 0;
                let l=0;
                for(l = 0; l<size(item[0].ratingArr);l++){
                    sum= sum + item[0].ratingArr[l].rating
                }
                res.statusCode = 201;
                console.log((sum/l).toPrecision(2)+"");
                res.json((sum/l).toPrecision(2)+"");
            }
        }
    })
}
exports.Premieresection = async(req , res ,next)=>{
    movieModel.find({section:'Premiere'},'poster name',(err ,item)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(item);
            res.json(item);
        }
    })
}
exports.onemovieRating = async(req , res ,next)=>{
    const userid = req.body.userid;
    const Movieid =req.body.Movieid;
    const rating = req.body.rating;
    const list = {
        userid:userid,
        rating:rating
    }
    movieModel.findOne({_id:Movieid}).then(item=>{
        let x = true;
        for(var k=0 ; k< size(item.ratingArr); k++){
            if(userid===item.ratingArr[k].userid){
                console.log("again rate");
                item.ratingArr[k].rating = rating;
                item.save();
                x=false;
            }
        }
        if(x===true){
            item.ratingArr.push(list);
        item.save();
        }
        res.statusCode =201;
        res.json('done');
    }).catch(err=>{
        res.statusCode = 404;
        res.json(err);
    })
}
exports.yourRating = async(req,res,next)=>{
    const userid = req.body.userid;
    const Movieid = req.body.Movieid;
    movieModel.findOne({_id:Movieid}).then(item=>{
        if(!item){
            res.statusCode = 404;
            res.json('no movie');
        }
        else{
            for(var k = 0 ; k < size(item.ratingArr) ; k++){
                if(userid===item.ratingArr[k].userid){
                    console.log('your rating');
                    res.statusCode = 201;
                    return res.json(item.ratingArr[k].rating+"");
                }
            }
            res.statusCode = 301;
            return res.json("0");
        }
    }).catch(err=>{
        console.log(err);
        res.statusCode = 404;
        res.json(err);
    })
}
exports.refreshArr = async(req,res,next)=>{
    user.findOne({_id:req.body.userid}).then(item=>{
        item.token = [];
        item.save();
        res.statusCode = 201;
        res.json('done');
 
    }).catch(err=>{
        console.log(err);
        res.statusCode = 404;
        res.json(err);
    })
}
exports.randomfxn = async(req , res , next)=>{
    const userid = req.body.userid;
    movieModel.find({genre:req.body.genre},(err ,result)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            s = size(result);
            var x = Math.floor(Math.random()*(s));
            user.findOne({_id:userid}).then(item=>{
                var i=0;
                for(i = 0 ; i < size(item.token) ; i++){
                    console.log(item.token);
                    if(size(item.token)==s){ 
                        console.log('khatam');
                        item.token = [];
                        item.save();
                        res.statusCode=301;
                        return res.json('empty');
                    }
                    if(x==item.token[i]){
                        console.log('loop')
                        x = Math.floor(Math.random()*(s));
                        console.log(x);
                        i=-1;
                    }
                }  
                item.token.push(x);
                item.save();
                console.log(x);
                res.json(result[x]);
            })
            .catch(err=>{
                res.statusCode = 404;
                res.json(err);
            })
        }
    });
}
exports.onemovieReview = async(req ,res ,next)=>{
    const userid = req.body.userid;
    const Movieid = req.body.Movieid;
    const review = req.body.review;
    const list = {
        userid:userid,
        review:review
    }
    movieModel.findOne({_id:Movieid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            let x = true;
            for(var k=0 ; k< size(item.reviewArr); k++){
                if(userid===item.reviewArr[k].userid){
                    item.reviewArr[k].review = review;
                    res.json('review edited')
                    item.save();
                    x=false;
                }
            }
            if(x===true){
                item.reviewArr.push(list);
                res.json('review saved')
                item.save();
            }
            res.statusCode = 201;
        }
    })
}
exports.userdetails = async(req,res,next)=>{
    const userid =req.body.userid;
    user.findOne({_id:userid},'dpUrl name',(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            res.statusCode =202;
            res.json(item)
            console.log(item);
        }
    }) 
}
exports.onemovieReviewshow=async(req,res,next)=>{
    const Movieid = req.body.Movieid;
    movieModel.findOne({_id:Movieid},async(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            res.statusCode = 201;
            res.json(item.reviewArr);
            console.log(item.reviewArr);
        }
    })
}
exports.history = async(req ,res ,next)=>{
    const userid = req.body.userid;
    const Movieid = req.body.Movieid;
    movieModel.findOne({_id:Movieid},(err,result)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            result.views++;
            result.save();
            user.findOne({_id:userid},(err,item)=>{
                let x = true;
                for(let k = 0 ; k < size(item.history) ; k++){
                    if(Movieid===item.history[k]){
                        console.log('again');
                        res.statusCode = 301;
                        res.json('again');
                        x = false;
                    }
                }
                if(x===true){
                    item.history.push(Movieid);
                    res.statusCode = 201;
                    res.json('added in history');
                    item.save();
                }
            })
        }
    })
}
exports.showHistory = async (req , res ,next)=>{
    const userid = req.body.userid;
    user.findOne({_id:userid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            console.log(item.history);
            res.statusCode = 201;
            res.json(item.history);
        }
    })
}
exports.movieCount = async (req ,res ,next)=>{
    const userid = req.body.userid;
    user.findOne({_id:userid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            console.log(size(item.history));
            res.statusCode = 201;
            res.json(size(item.history)+"");
        }
    })
}
exports.onemovieWishlist = async(req,res,next)=>{
    const Movieid =req.body.Movieid;
    const userid = req.body.userid;
    user.findOne({_id:userid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            let x = true;
            console.log(size(item.wishlistArr));
            for(let k =0 ; k<size(item.wishlistArr);k++){
                if(Movieid===item.wishlistArr[k]){
                    console.log("again");
                    item.wishlistArr.splice(k,1);
                    res.statusCode = 301;
                    res.json('removed from wishlist')
                    x=false;
                    item.save()
                }
            }
            if(x===true){
                item.wishlistArr.push(Movieid);
                res.statusCode =201;
                res.json('added to wishlist')
                item.save();
            }
        }
    })
}
exports.onemovieWishlistshow = async(req,res,next)=>{
    const Movieid =req.body.Movieid;
    const userid = req.body.userid;
    user.findOne({_id:userid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            let x = true;
            for(let k =0 ; k<size(item.wishlistArr);k++){
                if(Movieid===item.wishlistArr[k]){
                    console.log(1);
                    res.json("1");
                    x = false;
                }
            }
            if(x===true){
                console.log(0);
                res.json("0");
            }
        }
    });
}
exports.Allwishlist = async (req ,res,next)=>{
    const userid = req.body.userid;
    user.findOne({_id:userid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json('no user');
        }
        else{
            console.log(item.wishlistArr);
            res.statusCode = 201;
            res.json(item.wishlistArr);
        }
    })
}
exports.deleteHistory = async(req , res ,next)=>{
    const userid = req.body.userid;
    user.findOne({_id:userid},(err,item)=>{
        if(err){
            console.log(err);
            res.statusCode = 404;
            res.json(err);
        }
        else{
            item.history=[];
            item.save();
            res.statusCode = 201;
            res.json('history cleared')
        }
    })
}
exports.feedback = async(req ,res,next)=>{
    const email= req.body.email;
    const feed = req.body.feed;
    user.findOne({email:email}).then(result=>{
        transport.sendMail({
            to:email,
            from:'kyabaathai21@gmail.com',  
            subject:'Thankyou For Your Feedback',
            html:`<h3> Thank you for taking the time to write this, and for pointing out these issues. We work hard to give all of our customers a great experience, and we want to keep improving. </h3>`
        })
        res.statusCode=201;
        console.log('feedback send');
        res.json("feedback send");
    })
}









exports.appLink = async (req,res, next)=>{
    const link = [{
        "relation": ["delegate_permission/common.handle_all_urls"],
        "target": {
          "namespace": "android_app",
          "package_name": "com.example.cinebuzz",
          "sha256_cert_fingerprints":
          ["B2:D1:EE:25:FD:3D:03:D5:2E:74:7B:88:CF:DE:B9:0D:D1:A8:0F:1F:BD:84:46:D8:CC:CF:AB:5A:74:96:13:1A"]
        }
      }];
    res.statusCode = 201;  
    res.json(link);
}




































// exports.testAPI = async(req ,res , next)=>{
//     movieModel.aggregate( [{ $group: { _id: "$genre" , views:{$sum:"$views"}} }])
//     .then(result=>{
//         res.json(result);
//     })
// }
exports.testAPI = async(req ,res , next)=>{
    movieModel.aggregate([{
        $group: { 
            "_id": "$genre",
            "views":{$sum:"$views"}
        }},
        {$sort:{
            "views":-1
        }}
    ])
    .then(result=>{
        res.json(result);
    })
}