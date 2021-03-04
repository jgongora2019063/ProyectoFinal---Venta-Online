'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    
    console.log("Successful database connection");

    app.listen(3000, function(){
        console.log("Server running on port 3000")
    })
}).catch(err => console.log(err)) 