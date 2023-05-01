const mongoose = require('mongoose')

const Shema = mongoose.Schema
// shema on defini notre interface
const user = new Shema({
    // what we need to register an user
    firstName: {type : String, required : true},
    lastName: {type : String, required : true},
    email: {type : String , required : true}, 
    password : {type : String, required : true, minlength : 5},
    role : {type : String , default : "user"}
})

// on passe en model pour la lecture MongoDB
module.exports = mongoose.model('user', user)