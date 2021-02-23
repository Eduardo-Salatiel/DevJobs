const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'})

mongoose.connect(process.env.DATABASE,{useFindAndModify: true,useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.connection.on('error', (error) => {
    console.log(error);
})
//MODELOS
require('./../models/Vacantes')
require('./../models/Usuarios')