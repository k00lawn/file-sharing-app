require("dotenv").config()
const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose');
const upload = multer({ dest: 'uploads/' })
const bcrypt = require('bcrypt')
const File = require('./models/File')
const app = express()

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log(`Connected to ${process.env.DATABASE_URL}`)
})

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/upload', upload.single('file'), async (req, res) => {

  const fileData = {
    path: req.file.path,
    originalname: req.file.originalname
  }

  if(req.body.password !== null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10)
  }

  const file = await File.create(fileData)

  res.render('index', {fileLink: `${req.headers.origin}/file/${file.id}`})

  console.log(file)
})

app.route('/file/:id')
.get(handlePassword)
.post(handlePassword)

async function handlePassword (req, res) {
  const file = await File.findById(req.params.id)
  console.log(req.body.password)
  if(file.password != null) {
    if(req.body.password == null) {
      res.render('password')
      console.log('111111')
      return
    }

    if(!(await bcrypt.compare(req.body.password, file.password))) {
      res.render('password', {error: true})
      console.log('22222222')
      return
    }
  }

  file.downloadCount++
  await file.save()

  res.download(file.path, file.originalname)
}

app.listen(process.env.PORT, () => {
  console.log(`file-sharing app listening on port ${process.env.PORT}`)
})