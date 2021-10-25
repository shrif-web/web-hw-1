const localHost = 'http://127.0.0.1';
const port = '5500';

const makePostRequest = async (path, data) => {
    return await axios.post(host + path, data);
};

const makeGetRequest = async (path) => {
    return await axios.get(host + path);
};

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));            
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function computeSha(){
    const id = "inputFromStr"
    const x = document.getElementById(id).value
    const hashedStr = await sha256(x)
    document.getElementById("output1").value = hashedStr
    return 0
}

async function set(GoOrNode){
    const id = "inputFromStr"
    const x = document.getElementById(id).value
    const toStrX = x.toString()
    if (toStrX.length < 8 ){
        redFlagRise(id)
        const msg = 'Not Enough Chars(At least 8)'
        alert(msg)
        return -1
    }
    redFlagClear(id)
    const hashedStr = await sha256(x)
    document.getElementById("output1").value = hashedStr

    const jsonReq = {
        "requestType": 0,
        "str": toStrX,
        "hashedString": hashedStr,
    }

    switch(GoOrNode) {
        case "node":
            var path = localHost+':'+port;
            var extention = '/node/sha256';
            var fpath = path+extention
            var res = await makePostRequest(fpath, jsonReq)
        case "go":
            var path = localHost+':'+port;
            var extention = '/go/sha256';
            var fpath = path+extention
            var res = await makePostRequest(fpath, jsonReq)
        default:
            console.log("Not a valid path(set)")
            return -1;
    }    
    return 0
}



async function get(GoOrNode){
    id = "inputFromSha"
    const hashedStr = document.getElementById(id).value

    switch(GoOrNode) {
        case "node":
            var path = localHost+':'+port;
            var extention = '/node/sha256';
            var fpath = path+extention
            var res = await makeGetRequest(fpath)
        case "go":
            var path = localHost+':'+port;
            var extention = '/go/sha256';
            var fpath = path+extention
            var res = await makeGetRequest(fpath)
        default:
            console.log("Not a valid path(get)")
            return -1
    }    
    switch (res.result){
        case 0: 
            console.log("Short String")
        case 1: 
            console.log("inDB");
            document.getElementById('output2').value = res.str;
        case 2: 
            console.log("outDB");
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