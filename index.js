'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    
    console.log("Conexión a la base de datos exitosa");

    app.listen(3000, function(){
        console.log("Servidor corriendo en el puerto 3000")
    })
}).catch(err => console.log(err)) 