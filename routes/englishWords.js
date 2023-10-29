const express = require('express')
const Word = require('../models/Word')
const router = express.Router()

router.post('/addWords', async (req, res) => {
    try {
        const wordEn = req.body.wordEn
        const wordTr = req.body.wordTr
        const newWord = new Word({ wordEn, wordTr })
        await newWord.save()

        res.status(201).send('Word saved successfully')
        console.log(req.body)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error saving word: ' + error.message)
    }
});

router.get('/getWords', async (req, res) => {
    try {
        let words = await Word.find({}, 'wordEn wordTr')

        if (words.length < 5) {
            const extraWords = ["improve", "your", "written", "English", "easily"]
            words = words.concat(extraWords.map(word => ({ wordEn: word })))
        }
        res.status(200).json(words)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting words: ' + error.message)
    }
})

router.get('/getRandomTranslation', async (req, res) => {
    try {
        const words = await Word.find({}, 'wordTr wordEn')
        const randomIndex = Math.floor(Math.random() * words.length)
        const randomTranslation = words[randomIndex]
        res.status(200).json({ translation: randomTranslation })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error getting random translation: ' + error.message })
    }
})

router.delete('/getWords', async (req, res) => {
    try {
        await Word.deleteMany({})
        res.json({ message: 'All words deleted successfully' })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ error: 'Failed to delete words' })
    }
})

module.exports = router

