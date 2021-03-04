'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'Clave_Proyecto_Final'

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        user: user.user,
        rol: user.rol,
        iat: moment().unix(),
        exp: moment().day(10,'days').unix()
    }
    return jwt.encode(payload, secret)
}