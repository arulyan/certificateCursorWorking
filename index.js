const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const multer = require('multer')
const path = require('path')
const imagesize = require('image-size')
const gm = require('gm')
const normalize = require('normalize-path');
const xlsx = require("xlsx")

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.use(express.static(__dirname))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        cb(null, file.originalname)
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
        var widthO = dimensions.width
        var heightO = dimensions.height
        const ratio = widthO / heightO
        console.log(widthO + " lol: " + heightO + " blahblah " + ratio)
        if (widthO > 800) {
            widthO = 800
            heightO = widthO / ratio
        }
        res.render('image.ejs', { url: correctPath, name: req.file.filename, width: widthO, height: heightO })
        // res.send("Image Uploaded")
    }
})

app.post('/resize/uploads/:path', (req, res) => {
    //date naming
    var d = new Date()
    var day = d.getDate()
    var month = d.getMonth()
    var year = d.getFullYear()

    //getting orig image path n getting its orig dim which is used in calc. the coordinates
    var image = "./uploads/" + req.params.path
    console.log("This is the params:" + req.params)
    const dimensions = imagesize(image)
    const origWidth = dimensions.width
    const origHeight = dimensions.height
    console.log("Brosky Dosky" + origWidth)

    //Getting form data from ejs
    var fontColor = req.body.fontColor
    var fontSize = req.body.fontSize

    //getting x n y coordinates
    var xx = req.body.x
    var yy = req.body.y

    //Setting the x n y coordinated according to the original image
    xx *= origWidth
    yy *= origHeight

    console.log("the color is:" + fontColor)
    // .resize(width, height)
    const img = gm(image)
        .fill(fontColor)
        .font('Arial', fontSize)
    // img.resize(width, height)
    console.log("xx:" + xx + "\n" + "yy:" + yy)
    img.drawText(xx, yy, "Arulyan Asokan");
    var outputImgPath = '/modified/output' + '-' + day + '-' + month + '-' + year + '.png'

    // Getting out img path n showing that img in preview.ejs, also sending the img dimensions

    var widthO = dimensions.width
    var heightO = dimensions.height
    const ratio = widthO / heightO
    console.log(widthO + " lol: " + heightO + " blahblah " + ratio)
    if (widthO > 800) {
        widthO = 800
        heightO = widthO / ratio
    }

    //Appliying effects over the image
    img.write('./modified/output' + '-' + day + '-' + month + '-' + year + '.png', err => {
        if (err) return console.error(err);
        console.log(outputImgPath)
        console.log('done');
        res.render('preview.ejs', { url: outputImgPath, width: widthO, height: heightO,imgUrl: req.params.path })
    });
    // .write('./modified/output.png', (err) => {
    //     if (err) {
    //         res.send(err)
    //     }
    //     res.download("./modified/output.png")
    // })
})

app.post('/resize/uploads/:path/excel', upload.single('excel'), (req, res, next) => {
    if (!req.file) {
        res.send("Please Upload an image")
    }
    else {
        var excelFilePath = 'uploads/' + req.file.filename
        console.log("So it works in Excel:" + req.params.path)
        //Reading and Extracting Files!
        var wb = xlsx.readFile(excelFilePath)
        var ws = wb.Sheets["Sheet1"]
        var data = xlsx.utils.sheet_to_json(ws)
        console.log(data)
        //Able to extract the Name values
        data.forEach((item) => {
            console.log(item.Email)
        })
        console.log("Uploaded the " + req.file.filename + " file")
        res.status(204).send()
    }
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})