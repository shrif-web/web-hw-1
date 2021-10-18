async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));            
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function set_nodejs(){
    var id = "inputFromStr"
    var x = document.getElementById(id).value
    toStrX = x.toString()
    if (toStrX.length < 8 ){
        redFlagRise(id)
        msg = 'Not Enough Chars(At least 8)'
        alert(msg)
        document.getElementById("output1").value = ''
        return -1
    }
    redFlagClear(id)
    var out = await sha256(x)
    document.getElementById("output1").value = out
    return 0
}

async function set_golang(){
    var id = "inputFromStr"
    var x = document.getElementById(id).value
    toStrX = x.toString()
    if (toStrX.length < 8 ){
        redFlagRise(id)
        msg = 'Not Enough Chars(At least 8)'
        alert(msg)
        document.getElementById("output1").value = ''
        return -1
    }
    redFlagClear(id)
    var out = await sha256(x)
    document.getElementById("output1").value = out
    return 0
}


async function get_nodejs(){
    id = "inputFromSha"
    var sha = document.getElementById(id).value
    document.getElementById('output2').value = 'Get function Working'
}

async function get_golang(){
    id = "inputFromSha"
    var sha = document.getElementById(id).value
    document.getElementById('output2').value = 'Get function Working'
}

function redFlagRise(id) {
    var inputVal = document.getElementById(id);
    inputVal.style.backgroundColor = '#FF000044';
}

function redFlagClear(id) {
    var inputVal = document.getElementById(id);
    inputVal.style.backgroundColor = "white";
}