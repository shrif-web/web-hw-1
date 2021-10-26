const localHost = 'http://localhost';
const port = '80';

const makePostRequest = async (path, data) => {     
    return await axios(path, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {'str': data}
        })  
};

const makeGetRequest = async (path, hashedStr) => {
    return await axios.get(path, {
        params:{
            "hashedString": hashedStr
        }
    });
};

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function computeSha() {
    const id = "inputFromStr"
    const x = document.getElementById(id).value
    const hashedStr = await sha256(x)
    document.getElementById("output1").value = hashedStr
    return 0
}

async function set(GoOrNode) {
    console.log("first request")
    const id = "inputFromStr"
    const x = document.getElementById(id).value
    const toStrX = x.toString()
    if (toStrX.length < 8) {
        redFlagRise(id)
        const msg = 'Not Enough Chars(At least 8)'
        alert(msg)
        return -1
    }
    redFlagClear(id)
    const hashedStr = await sha256(x)
    document.getElementById("output1").value = hashedStr

    const jsonReq = {
        "str": toStrX,
        "hashedString": hashedStr,
    }

    switch (GoOrNode) {
        case "node":
            console.log(GoOrNode)
            var path = localHost + ':' + port;
            var extention = '/node/sha256';
            var fpath = path + extention
            console.log(fpath)
            console.log("post request 58")
            var res = await makePostRequest(fpath, toStrX)
            break
        case "go":
            var path = localHost + ':' + port;
            var extention = '/go/sha256';
            var fpath = path + extention
            console.log(toStrX)
            var res = await makePostRequest(fpath, toStrX)
            console.log(res)
            break
        default:
            console.log("Not a valid path(set)")
            return -1;
    }
    return 0
}


async function get(GoOrNode) {
    console.log("second request")
    id = "inputFromSha"
    const hashedStr = document.getElementById(id).value
    const getRequest = {
        "str": "",
        "hashedString": hashedStr,
    }
    switch (GoOrNode) {
        case "node":
            var path = localHost + ':' + port;
            var extention = '/node/sha256';
            var fpath = path + extention
            var res = await makeGetRequest(fpath, hashedStr)
            break
        case "go":
            var path = localHost + ':' + port;
            var extention = '/go/sha256';
            var fpath = path + extention
            var res = await makeGetRequest(fpath, hashedStr)
            break
        default:
            console.log("Not a valid path(get)")
            return -1
    }
    console.log(res.data.value)
    switch (parseInt(res.data.value)) {
        case 0:
            console.log("error(Not Valid Request)")
            break
        case 1:
            console.log("inDB");
            document.getElementById('output2').value = res.data.str;
            break
        default:
            console.log('Not a valid res.result(get)');
    }
    return 0;
}

function redFlagRise(id) {
    const inputVal = document.getElementById(id);
    inputVal.style.backgroundColor = '#FF000044';
}

function redFlagClear(id) {
    const inputVal = document.getElementById(id);
    inputVal.style.backgroundColor = "white";
}
