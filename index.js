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

//Some Global Variables

var tempWidth, tempHeight
var globalImg
var originalWidth, originalHeight
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
        tempWidth = widthO
        tempHeight = heightO
        globalImg = req.file.filename
        var boxNo = 0
        res.render('image.ejs', { url: correctPath, name: req.file.filename, width: widthO, height: heightO, keys: keys, boxNo: boxNo })
        // res.send("Image Uploaded")
    }
})
var imagery;
var k = 0
var GlobalModifiedLatestImg, globalImgData = [], globalImgDataAllBoxes = [], max
app.post('/trialItUp/:path/:no', (req, res) => {
    //date naming
    var d = new Date()
    var day = d.getDate()
    var month = d.getMonth()
    var year = d.getFullYear()
    var time = d.getTime()
    var urlImg = req.params.path
    var boxNo = parseInt(req.params.no)
    //getting orig image path n getting its orig dim which is used in calc. the coordinates
    console.log("this is the 1st alfa:" + urlImg[0])
    var image
    if (k == 0 || urlImg[0] != 'o') {
        image = "./uploads/" + urlImg
        k++
    }
    else {
        image = "./modified/" + urlImg
    }
    // imagery = image
    console.log("This is the params:" + req.params.path)
    const dimensions = imagesize(image)
    const origWidth = dimensions.width
    const origHeight = dimensions.height
    console.log("Brosky Dosky" + origWidth)

    // //Getting form data from ejs
    var fontColor = req.body.fontColor
    var fontSize = req.body.fontSize
    var selection = req.body.e
    mrX = (req.body.a) * origWidth / tempWidth;
    mrY = (req.body.b) * origHeight / tempHeight;
    mrWidth = (req.body.c) * origWidth / tempWidth;
    mrHeight = (req.body.d) * origHeight / tempHeight;
    var obj = {
        "fontColor": fontColor,
        "fontSize": fontSize,
        "mrX": mrX,
        "mrY": mrY,
        "mrWidth": mrWidth,
        "mrHeight": mrHeight,
        "selection": selection
    }
    globalImgData[boxNo] = obj
    globalImgDataAllBoxes = []
    for (var i = 0; i <= boxNo; i++) {
        globalImgDataAllBoxes.push(globalImgData[i])
        console.log("So this is the End Game:\n" + globalImgData[i].selection + "\nThis is God!:\n" + globalImgDataAllBoxes[i].selection)
    }
    console.log("this is the box Data Dammit!" + globalImgData[0].selection)
    boxNo++
    max = boxNo
    console.log(obj)
    console.log("this is the selection:" + selection + "\n" + typeof (selection))
    // coorObj = JSON.parse(req.body.e)
    // console.log("Lets See how the trial looks like:\n" + coorObj.a)
    const img = gm(image)
        .fill(fontColor)
        .font('Arial', fontSize)
    // img.resize(width, height)
    // console.log("xx:" + xx + "\n" + "yy:" + yy)
    img.region(mrWidth, mrHeight, mrX, mrY).drawText(0, 0, onePersonData[selection], 'center');
    var filename = 'output' + '-' + time + '.png'
    var outputImgPath = '/modified/' + filename
    GlobalModifiedLatestImg = './modified/' + filename
    // Getting out img path n showing that img in preview.ejs, also sending the img dimensions

    var widthO = dimensions.width
    var heightO = dimensions.height
    const ratio = widthO / heightO
    // console.log(widthO + " lol: " + heightO + " blahblah " + ratio)
    if (widthO > 800) {
        widthO = 800
        heightO = widthO / ratio
    }

    //Appliying effects over the image
    img.write('./modified/' + filename, err => {
        if (err) return console.error(err);
        console.log(outputImgPath)
        console.log('done');
        res.render('image.ejs', { url: outputImgPath, name: filename, width: widthO, height: heightO, keys: keys, boxNo: boxNo })
    });
})

app.post('/getHim', (req, res) => {
    //date naming
    var d = new Date()
    var day = d.getDate()
    var month = d.getMonth()
    var year = d.getFullYear()
    //getting orig image path n getting its orig dim which is used in calc. the coordinates
    var image = "./uploads/" + globalImg //Imp, the path of the blank Certificate
    // imagery = image
    // console.log("This is the params:" + req.params)
    // const dimensions = imagesize(image)
    // const origWidth = dimensions.width
    // const origHeight = dimensions.height
    // console.log("Brosky Dosky" + origWidth)

    // //Getting form data from ejs
    // var fontColor = req.body.fontColor
    // var fontSize = req.body.fontSize

    // //getting x n y coordinates
    // var xx = req.body.x
    // var yy = req.body.y

    //Setting the x n y coordinated according to the original image
    // xx *= origWidth
    // yy *= origHeight

    // console.log("the color is:" + fontColor)
    // .resize(width, height)

    // mrX = (req.body.a) * origWidth / tempWidth;
    // mrY = (req.body.b) * origHeight / tempHeight;
    // mrWidth = (req.body.c) * origWidth / tempWidth;
    // mrHeight = (req.body.d) * origHeight / tempHeight;
    // coorObj = JSON.parse(req.body.e)
    // console.log("Lets See how the trial looks like:\n" + coorObj.a)
    for (var j = 0; j < allPeopleData.length; j++) {
        var img = gm(image)
        for (var i = 0; i < max; i++) {
            localSelection = globalImgDataAllBoxes[i].selection
            img.fill(globalImgDataAllBoxes[i].fontColor)
            img.font('Arial', globalImgDataAllBoxes[i].fontSize)
            // img.resize(width, height)
            // console.log("xx:" + xx + "\n" + "yy:" + yy)
            img.region(globalImgDataAllBoxes[i].mrWidth, globalImgDataAllBoxes[i].mrHeight, globalImgDataAllBoxes[i].mrX, globalImgDataAllBoxes[i].mrY).drawText(0, 0, allPeopleData[j][localSelection], 'center');
        }
        console.log("This shud be selection:"+allPeopleData[j][localSelection])
        var outputImgPath = '/modified/' + allPeopleData[j].Name + '-' + day + '-' + month + '-' + year + '.png'
        img.write('./modified/' + allPeopleData[j].Name + '-' + day + '-' + month + '-' + year + '.png', err => {
            if (err) return console.error(err);
            console.log(outputImgPath)
            console.log('done');
        });
    }
    res.status(204).send()
    // img.region(mrWidth, mrHeight, mrX, mrY).drawText(300,300,'22-may-2020')
    // img.region(mrWidth, mrHeight, mrX, mrY).drawText(600,600,"World Champion")
    // img.drawText(500, 500, "Arulyan Asokan");


    // Getting out img path n showing that img in preview.ejs, also sending the img dimensions

    // var widthO = dimensions.width
    // var heightO = dimensions.height
    // const ratio = widthO / heightO
    // console.log(widthO + " lol: " + heightO + " blahblah " + ratio)
    // if (widthO > 800) {
    //     widthO = 800
    //     heightO = widthO / ratio
    // }

    //Appliying effects over the image

    // .write('./modified/output.png', (err) => {
    //     if (err) {
    //         res.send(err)
    //     }
    //     res.download("./modified/output.png")
    // })
})

var keys, onePersonData, allPeopleData
app.post('/resize/uploads/excel', upload.single('excel'), (req, res, next) => {
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
        allPeopleData = data
        onePersonData = data[0]
        console.log("So this is the data[0]:" + onePersonData["Name"])
        keys = [];
        for (var k in data[0]) {
            keys.push(k)
        }
        console.log("total:" + keys.length + "keys:" + keys[0])
        //Able to extract the Name values
        data.forEach((item) => {
            console.log(item.Email)
        })
        console.log("Uploaded the " + req.file.filename + " file")
        res.status(204).send()
    }
})

app.post("/checkinUp", (req, res) => {
    console.log(req.body.a + req.body.b)
    const img = gm(imagery)
        .fill('#000000')
        .font('Arial', 80)
    img.region(req.body.c, req.body.d, req.body.a, req.body.b).drawText(0, 0, 'Arulyan Asokan', 'center');
    img.write('output' + '.png', (err) => {
        if (err) {
            res.send("is this sending err:" + err)
        }
        res.download("/output.png")
    })
    // // img.drawText(xx, yy, "Arulyan Asokan");
    // // var outputImgPath = '/modified/output' + '-' + day + '-' + month + '-' + year + '.png'
    // res.json({
    //     xCoor: req.body.a,
    //     yCoor: req.body.b
    // })
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000")
})