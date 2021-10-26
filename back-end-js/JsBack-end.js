const express = require("express");
const bodyParser = require("body-parser")
const redis = require("redis")
const cors = require("cors")
const crypto = require("crypto")
const path = require("path")
const app = express();
app.use(cors());


const port = 8080

const client = redis.createClient()

const ResultsEnum = Object.freeze({
    shortString: 0,
    inDB: 1,
    outDB: 2,
    error: 3
})
const RequestEnum = Object.freeze({
    hashForSave: 0,
    getDB: 1
})

app.use(bodyParser.json())
//temporary should be done by nginx
// app.get("/", function (req, res) {
//     res.sendFile(__dirname + "/struct.html");
// });
// app.get('/action.js', function(req, res) {
//     res.sendFile(__dirname + "/" + "action.js");
// });
// app.get('/style.css', function(req, res) {
//     res.sendFile(__dirname + "/" + "style.css");
// });

app.post("/", function (req, res) {
    try {

        let request = req.body
        console.log(request)
        let r = new Respond();
        console.log(req.body)
        let hash;
        if (req.body.str.toString().length < 8) {
            r.result = ResultsEnum.shortString
            res.statusCode = 411 //length required
            res.send(r)
        } else {
            hash = crypto.createHash('sha256').update(request.str).digest('base64');
            r.hashed = request.hash
            client.exists(hash, function (err, reply) {
                // data is null if the key doesn't exist
                if (reply !== 1) {
                    r.result = ResultsEnum.outDB
                    client.set(request.hashedString, request.str, redis.print)
                } else {
                    r.result = ResultsEnum.inDB
                    client.set(request.hashedString, request.str, redis.print)
                }
                res.statusCode = 201
                res.send(r);
            });
        }
    }
    catch (e) {
        sendBadRequest(res)
    }
});
app.get('/', (req, res) => {
    a = 1
    try {
        let request = req.query
        console.log(request)
        let r = new Respond();
        client.get(request.hashedString, function (err, data) {
            // data is null if the key doesn't exist
            console.log(data)
            if (err || data == null) {
                res.statusCode = 204 //no content
                r.result = ResultsEnum.outDB
            } else {
                r.str = data
                res.statusCode = 200
                r.result = ResultsEnum.inDB
            }
            res.send(r);
        });
    } catch (e) {
        sendBadRequest(res)
    }
})

function sendBadRequest(res) {
    res.statusCode = 400
    let r = new Respond();
    r.result = ResultsEnum.error
    res.send(r)
}

app.use((req, res, next) => {
    res.status(404).send("<h1>Page not found on the server</h1>")
})

app.listen(port, function () {
    console.log("server is running on port", port);
})


class Respond {
    str
    result
}

class Request {
    str
    hashedString
}