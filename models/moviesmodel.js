const mongoose = require('mongoose');
const { array } = require('../utils/multer');
const movieschema = mongoose.Schema({
    section:{
        type:String
    },
    name:{
        type:String,
    },
    poster:{
        type:String
    },
    SrNo:{
        type:Number
    },
    video:{
        type:String
    },
    genre:{
        type:String
    },
    views:{
        type:Number
    },
    year:{
        type:String
    },
    plot:{
        type:String
    },
    ratingArr:[{userid:String,rating:Number}],
    reviewArr:[{userid:String,review:String}],
})
module.exports = mongoose.model('movies',movieschema);