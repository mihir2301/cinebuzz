const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const homepageRoutes =require('./routes/homepage');
const onemovieRoutes = require('./routes/onemovie');
const saveRoutes = require('./routes/save');
const searchRoutes = require('./routes/search');
const cors =require('cors');

const app = express();
app.use(express.json());
app.use('/video',express.static(__dirname+'/video'));
app.use(cors());

app.use(authRoutes);
app.use(homepageRoutes);
app.use(onemovieRoutes);
app.use(searchRoutes);
app.use(saveRoutes);
    
mongoose.connect(process.env.DB,()=>{
    console.log('connected');
    app.listen(process.env.PORT);
});
