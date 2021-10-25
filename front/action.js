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
    const out = await sha256(x)
    document.getElementById("output1").value = out
    return 0
}

async function set_nodejs(){
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
    const out = await sha256(x)
    document.getElementById("output1").value = out
    return 0
}

async function set_golang(){
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
    const out = await sha256(x)
    document.getElementById("output1").value = out
    return 0
}


async function get_nodejs(){
    id = "inputFromSha"
    const sha = document.getElementById(id).value
    document.getElementById('output2').value = 'Get function Working'
}

async function get_golang(){
    id = "inputFromSha"
    const sha = document.getElementById(id).value
    document.getElementById('output2').value = 'Get function Working'
}

function redFlagRise(id) {
    const inputVal = document.getElementById(id);
    inputVal.style.backgroundColor = '#FF000044';
}

function redFlagClear(id) {
    const inputVal = document.getElementById(id);
    inputVal.style.backgroundColor = "white";
}