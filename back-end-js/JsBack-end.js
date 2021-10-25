const express = require("express");
const bodyParser = require("body-parser")
const redis = require("redis")
const crypto = require("crypto")
// sajad added this
var cors = require('cors')
var path = require('path');
// sajad added this
const app = express();
app.use(cors())

const client = redis.createClient()

const ResultsEnum = Object.freeze({
    shortString: 0,
    inDB: 1,
    outDB: 2
})
const RequestEnum = Object.freeze({
    hashForSave: 0,
    getDB: 1
})
client.set("key", "valuee", redis.print);
client.get("key", redis.print);

// New app using express module
app.use(bodyParser.json())
// app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile('/front/struct.html', {root: path.resolve(__dirname, '..')});
});
app.get('/action.js', function(req, res) {
    res.sendFile('/front/action.js', {root: path.resolve(__dirname, '..')});
});
app.get('/style.css', function(req, res) {
    res.sendFile('/front/style.css', {root: path.resolve(__dirname, '..')}); 
});

app.post("/", function (req, res) {
    let request = req.body
    request.requestType = parseInt(request.requestType)
    console.log(request)
    let r = new Respond();

    if (request.requestType === RequestEnum.hashForSave) {
        console.log(req.body)
        let hash;
        if (req.body.str.toString().length < 8) {
            r.result = ResultsEnum.shortString
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
                res.send(r);
            });
        }
    } else if (request.requestType === RequestEnum.getDB) {
        client.get(request.hashedString, function (err, data) {
            // data is null if the key doesn't exist
            console.log(data)
            if (err||data == null) {
                r.result = ResultsEnum.outDB
            } else {
                r.str = data
                r.result = ResultsEnum.inDB
            }
            res.send(r);
        });
    }
});

app.listen(3000, function () {
    console.log("server is running on port 3000");
})

class Respond {
    str
    result
}

class Request {
    requestType
    str
    hashedString
}