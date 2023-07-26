const mongoose = require('mongoose');
const { array } = require('../utils/multer');

userloginschema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type: String,
    },
    pass:{
        type: String,
    },
    dpUrl:{
        type:String
    },
    token:[String],
    wishlistArr:[String],
    history:[String]
});
module.exports = mongoose.model('user',userloginschema);