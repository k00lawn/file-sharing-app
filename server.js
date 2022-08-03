require("dotenv").config()
const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose');
const upload = multer({ dest: 'uploads/' })

const app = express()

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/fileSharing', () => {
    console.log("Connected to MongoDB")
  }, (e) => console.log(e));
}


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('hi')
})


app.listen(process.env.PORT, () => {
  console.log(`file-sharing app listening on port ${process.env.PORT}`)
})