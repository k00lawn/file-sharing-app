const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

const port = 3000;

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('hi')
})


app.listen(port, () => {
  console.log(`file-sharing app listening on port ${port}`)
})