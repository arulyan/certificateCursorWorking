const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const multer = require('multer')
const path = require('path')
const imagesize = require('image-size')
const gm = require('gm')
const normalize = require('normalize-path');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.use(express.static(__dirname))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        res.send("Please Upload an image")
    }
    else {
        var correctPath = normalize(req.file.path)
        console.log(correctPath)
        const dimensions = imagesize(req.file.path)
        res.render('image.ejs', { url: correctPath, name: req.file.filename, width: dimensions.width, height: dimensions.height })
        // res.send("Image Uploaded")
    }
})

app.post('/resize/uploads/:path', (req, res) => {
    var image = req.params.path
    var xx = req.body.x
    var yy = req.body.y
    // .resize(width, height)
    const img = gm('uploads/' + image)
        .fill('#000000')
        .font('Arial', 80)
        // .drawText(225, 75, "Some text");
    let x = 460;
    let y = 460;
    // img.resize(width, height)
    console.log("xx:"+xx+"\n"+"yy:"+yy)
    img.drawText(xx, yy, "Arulyan");
    img.write('./modified/output.png', err => {
        if (err) return console.error(err);
        console.log('done');
        res.end()
    });
    // .write('./modified/output.png', (err) => {
    //     if (err) {
    //         res.send(err)
    //     }
    //     res.download("./modified/output.png")
    // })
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})