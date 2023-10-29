const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
let app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const path = require('path')
const Word = require('./models/Word')

const PORT = process.env.PORT || 5000

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname))

const wordRoutes = require('./routes/englishWords')
app.use(wordRoutes)

async function start(){
    try{
        await mongoose.connect('mongodb+srv://root:root@cluster0.xpofjcw.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true
        })
        app.listen(PORT, ()=>{
            console.log(`Server started on port ${PORT}...`)
        })
    }catch (e){
        console.log(e)
    }
}

start()





