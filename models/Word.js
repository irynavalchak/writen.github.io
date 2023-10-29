const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
    wordEn: String,
    wordTr: String
})

module.exports = mongoose.model('Word', wordSchema)
