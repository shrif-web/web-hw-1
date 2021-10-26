const express = require("express");
const bodyParser = require("body-parser")
const redis = require("redis")
const cors = require("cors")
const crypto = require("crypto")
const path = require("path")
const app = express();
app.use(cors());

const port = 3000

const client = redis.createClient()

const ResultsEnum = Object.freeze({
    error: 0,
    inDB: 1
})
const RequestEnum = Object.freeze({
    hashForSave: 0,
    getDB: 1
})

app.use(bodyParser.json())
app.post("/", function (req, res) {
    try {
        let request = req.query
        console.log(request)
        let r = new Respond();
        let hash;
        if (request.str < 8) {
            r.value = ResultsEnum.error
            res.statusCode = 411 //length required
            res.send(r)
        } else {
            hash = crypto.createHash('sha256').update(request.str).digest('hex');
            r.hashed = request.hash
            client.exists(hash, function (err, reply) {
                // data is null if the key doesn't exist
                if (reply !== 1) {
                    r.value = ResultsEnum.error
                    client.set(hash, request.str, redis.print)
                } else {
                    r.value = ResultsEnum.inDB
                    client.set(hash, request.str, redis.print)
                }
                res.statusCode = 201
                res.send(r);
            });
        }
    } catch (e) {
        sendBadRequest(res)
    }
});
app.get('/', (req, res) => {
    try {
        let request = req.query
        console.log(request)
        let r = new Respond();
        client.get(request.hashedString, function (err, data) {
            // data is null if the key doesn't exist
            console.log(data)
            if (err || data == null) {
                res.statusCode = 204 //no content
                r.value = ResultsEnum.error
            } else {
                r.str = data
                res.statusCode = 200
                r.value = ResultsEnum.inDB
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
    value
}

class Request {
    str
    hashedString
}
