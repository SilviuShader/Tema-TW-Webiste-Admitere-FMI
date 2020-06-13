const express = require("express");
const uuid = require("uuid");
const fs = require("fs");
const mergeImages = require("merge-images");
const {
    Canvas,
    Image
} = require("canvas");
var sizeOf = require("image-size");

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

const app = express();

app.set('trust proxy', true);
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(express.json({
    limit: "10mb"
}));

// create
app.post("/subjects", (request, response) => {
    const subjects = readJSONFile();

    let data = request.body;
    data.id = uuid.v1();
    let filename = "images/" + "su-" + data.id + ".png";
    saveImage(data.img, filename);
    data.img = filename;

    filename = "images/" + "so-" + data.id + ".png";
    saveImage(data.solImg, filename);
    data.solImg = filename;

    subjects.push(data);

    writeJSONFile(subjects);

    pushToLog({
        ip: request.ip,
        message: `a adaugat un nou subiect de ${data.exercise}: ` + data.name
    });

    response.json({
        status: "success"
    });
});

// read all
app.get("/subjects", (request, response) => {
    let subjects = readJSONFile();

    subjects.forEach(element => {
        delete element.img;
        delete element.solImg;
    });

    pushToLog({
        ip: request.ip,
        message: "a cerut sa vizualizeze lista de subiecte."
    });

    response.json(subjects);
});

// update
app.put("/subjects/:id", (request, response) => {
    let id = request.params.id;
    let subjects = readJSONFile();

    let crtVal = subjects.find(x => x.id == id);
    let index = subjects.indexOf(crtVal);
    let obj = crtVal;
    obj.name = request.body.name;
    obj.exercise = request.body.exercise;

    if (request.body.img) {
        let filename = "images/" + "su-" + id + ".png";
        saveImage(request.body.img, filename);
    }
    if (request.body.solImg) {
        let filename = "images/" + "so-" + id + ".png";
        saveImage(request.body.solImg, filename);
    }

    subjects[index] = obj;

    pushToLog({
        ip: request.ip,
        message: `a modificat un subiect de ${obj.exercise}: ` + obj.name
    });

    writeJSONFile(subjects);

    response.json({
        status: "success"
    });
});

// read one
app.get("/subjects/:id", (request, response) => {
    let id = request.params.id;
    let subjects = readJSONFile();

    let crtVal = subjects.find(x => x.id == id);

    console.log(crtVal);
    let img = getImgSrcString(readImage(crtVal.img));
    crtVal.img = img;
    let solImg = getImgSrcString(readImage(crtVal.solImg));
    crtVal.solImg = solImg;

    pushToLog({
        ip: request.ip,
        message: `a cerut sa vada subiectul de ${crtVal.exercise}: ` + crtVal.name
    });

    response.json(crtVal);
});

// delete
app.delete("/subjects/:id", (request, response) => {
    let subjects = readJSONFile();

    let id = request.params.id;
    let targetObject = subjects.find(x => x.id == id);

    pushToLog({
        ip: request.ip,
        message: `a sters subiectul de ${targetObject.exercise}: ` + targetObject.name
    });

    let path = targetObject.img;
    fs.access(path, error => {
        if (!error) {
            fs.unlinkSync(path);
        } else
            console.log(error);
    });

    let path2 = targetObject.solImg;
    fs.access(path2, error => {
        if (!error) {
            fs.unlinkSync(path2);
        } else
            console.log(error);
    });

    subjects.splice(subjects.indexOf(targetObject), 1);

    writeJSONFile(subjects);

    response.end();
});

app.get("/exam", asyncMiddleware(async (request, response) => {
    let subjects = readJSONFile();

    let result = {
        images: []
    };

    let algebra = subjects.filter(x => x.exercise == "algebra");
    let calculus = subjects.filter(x => x.exercise == "calculus");
    let geometry = subjects.filter(x => x.exercise == "geometry");
    let informatics = subjects.filter(x => x.exercise == "informatics");

    let chosenSubjects = [];
    chosenSubjects.push(algebra[Math.floor(Math.random() * algebra.length)]);
    chosenSubjects.push(calculus[Math.floor(Math.random() * calculus.length)]);
    chosenSubjects.push(geometry[Math.floor(Math.random() * geometry.length)]);
    chosenSubjects.push(informatics[Math.floor(Math.random() * informatics.length)]);

    await pushImages(result.images, chosenSubjects, "subject");
    await pushImages(result.images, chosenSubjects, "solution");

    pushToLog({
        ip: request.ip,
        message: `a primit un examen care consta in: algebra: ${chosenSubjects[0].name}, analiza: ${chosenSubjects[1].name}, geometrie: ${chosenSubjects[2].name}, informatica: algebra: ${chosenSubjects[3].name}`
    });

    /*
    image = {};

    image.data = getImgSrcString(readImage(subjects[0].solImg));
    image.type = "solution";
    result.images.push(image);*/

    response.json(result);
}));

async function pushImages(resultArr, chosenSubjects, type) {
    let dimensions = [];

    chosenSubjects.forEach(element => {
        if (type == "subject")
            dimensions.push(sizeOf(element.img));
        else
            dimensions.push(sizeOf(element.solImg));
    });

    let image = {};
    let crtY = 0;
    let imgArr = [];
    let index = 0;

    const maxImageHeight = 1080;

    for (element of chosenSubjects) {
        if (crtY + dimensions[index].height > maxImageHeight) {
            image.data = await mergeImages(imgArr, {
                Canvas: Canvas,
                Image: Image,
                height: maxImageHeight
            });
            image.type = type;
            resultArr.push(image);
            image = {};
            crtY = 0;
            imgArr = [];
        }

        let img = element.img;

        if (type == "solution")
            img = element.solImg;

        imgArr.push({
            src: img,
            y: crtY
        });

        crtY += dimensions[index].height;

        index++;
    }

    if (imgArr.length != 0) {
        console.log(imgArr);
        image.data = await mergeImages(imgArr, {
            Canvas: Canvas,
            Image: Image,
            height: maxImageHeight
        });
        image.type = type;
        resultArr.push(image);
    }
}

function getImgSrcString(data) {
    let imgSrcString = `data:image/${".png".split('.').pop()};base64,${data}`;
    return imgSrcString;
}

function readImage(filename) {
    let data = fs.readFileSync(filename);
    let base64Image = new Buffer(data, 'binary').toString('base64');
    return base64Image;
}

function saveImage(imgData, filename) {
    let base64Data = imgData.replace(/^data:image\/png;base64,/, "");
    let buff = new Buffer(base64Data, 'base64');
    fs.writeFileSync(filename, buff);
}

function pushToLog(logEvent) {
    let content = JSON.parse(fs.readFileSync("log.json"))["log"];

    content.push(`[${new Date().toLocaleString().replace(/T/, ' ').
                                       replace(/\..+/, '') }] ` + logEvent.ip + " " + logEvent.message);

    fs.writeFileSync(
        "log.json",
        JSON.stringify({
            log: content
        }),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}

function readJSONFile() {
    return JSON.parse(fs.readFileSync("db.json"))["subjects"];
}

function writeJSONFile(content) {
    fs.writeFileSync(
        "db.json",
        JSON.stringify({
            subjects: content
        }),
        "utf8",
        err => {
            if (err) {
                console.log(err);
            }
        }
    );
}