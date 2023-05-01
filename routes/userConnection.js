const router = require('express').Router() 
const bcrypt = require("bcrypt")
const saltRounds = 10
const userModel = require('../models/connection')
const jsw = require("jsonwebtoken")
const secret = "rotule-01"


router.post('/api/v1/user/register', async(req, res, next) => {
  
    const { firstName, lastName, email, password, passwordCheck} = req.body
    
    try {
        // check si tout les criters sont pas false 
        if(!firstName || !lastName || !email || !password || !passwordCheck) {
          return res.json({statut: 404, msg: "you have to fill all requirements"})
          
        } 
     
        // check si le mail existe deja 
        const find = await userModel.findOne({email})
        if(find){
          return res.json({statut : 400, msg:"user already exist"})
        }
        // check si password fait + de 6 caractes
        if(password.length < 5) {
          return res.json({statut : 400 , msg:"your passwor must be more than 5 caracters"})
        }
        
        // compare password au passwordCheck
        if(password !== passwordCheck){
          return res.json({statut : 400, msg: "password doesn't match!"})
        }

        // appel bcrypt == hash le passwor
        const hash = await bcrypt.hash(password, saltRounds)
        // on send l'objet avec le password hash ( action qui enregiste l'user dans la bdd)
        // instanciation de notre shema en lui envoyant les donnes de l'utisateur 
        
        let user = new userModel ({
          password : hash, 
          email : email, 
          lastName : lastName, 
          firstName : firstName,

        })
        const saveUser = await user.save()
        res.json({statut : 200, msg: "user saved", code : saveUser })

    } catch (error) {
        // on reception l'erreur
        res.json({statut: 500, msg: "an error occured while saving" , err : error.message})
    }
})


// login
router.post('/api/v1/user/login', async(req, res, next) => {
   
    try {
     
     const {password, email} = req.body
 
     // verifier si les champs sont tous remplis
     if(!password || !email) {
       return res.json({statut: 400, msg:"you have to fill all requirements"})
     }
 
     // verifier si le mail existe ou pas
     const user = await userModel.findOne({email})
     if(!user){
       return res.json({statut: 400, msg:"the mail entered doesn't exist"})
     }
 
     const match = await bcrypt.compare(password, user.password)
     if(!match){
         return res.json({statut : 400, msg:"the password entered is invalid"})
     }
 
     // créer notre jwt et l'attibuer a l'user
     const payload = {
       id : user._id,
       email : user.email,
     }
     
     const token = jsw.sign(payload, secret);
     res.json({
       statut : 200,
       token,
       user : {
         id : user._id,
         firstName : user.firstName,
         lastName : user.lastName,
         email:  user.email,
         role:  user.role
       }
     })
 
     
    } catch (error) {
       res.json({statut : 400, msg: 'error' , err : error})
    }
}) 


module.exports = router