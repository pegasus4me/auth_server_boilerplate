const express = require('express')
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static(__dirname + '/public'))

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.set('strictQuery', true)

const uri = "mongodb+srv://workflow:Pi6hib35mJYIVa4A@rotule.8z4m1rf.mongodb.net/workflow-desk?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then((db) => {

    // appel de routes
    app.use("/user", require('./routes/userConnection'))
    app.listen(9000, () => {
        console.log('running on port 9000')
    })
})
.catch(err => console.log("error niveau promesse mongoose.connect", err))
