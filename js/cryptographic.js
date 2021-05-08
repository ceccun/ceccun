// Ceccun Cryptographic Service

const crypto_sourceMap = "abcdefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.!~*'()%"

const encrypt = (data, key) => {
    let dataTable = crypto_sourceMap.split("");
    let newKey = btoa(encodeURIComponent(key)).split("");
    let keyTable = newKey;
    let keyOcc = {}
    let newKeyTable = [];
    let KeyNumber = 0;
    dataTable.forEach((item, index) => {
        if (KeyNumber >= keyTable.length) { KeyNumber = 0 }
        if (keyOcc[keyTable[KeyNumber]] == undefined){ keyOcc[keyTable[KeyNumber]] = 0; }
        newKeyTable.push(keyTable[KeyNumber] + keyOcc[keyTable[KeyNumber]]);
        keyOcc[keyTable[KeyNumber]] += 1;
        KeyNumber += 1;
    });
    let output = [];
    let dataenc = btoa(encodeURIComponent(data));
    dataenc.split("").forEach((item, index) => { output.push(newKeyTable[dataTable.indexOf(item)]); });
    return output.join(":");
}

const decrypt = (data, key) => {
    let dataTable = crypto_sourceMap.split("");
    let newKey = btoa(encodeURIComponent(key)).split("");
    let keyTable = newKey;
    let keyOcc = {}
    let newKeyTable = [];
    let KeyNumber = 0;
    dataTable.forEach((item, index) => {
        if (KeyNumber >= keyTable.length) { KeyNumber = 0 }
        if (keyOcc[keyTable[KeyNumber]] == undefined){ keyOcc[keyTable[KeyNumber]] = 0; }
        newKeyTable.push(keyTable[KeyNumber] + keyOcc[keyTable[KeyNumber]]);
        keyOcc[keyTable[KeyNumber]] += 1;
        KeyNumber += 1;
    });
    let output = [];
    data.split(":").forEach((item, index) => { output.push(dataTable[newKeyTable.indexOf(item)]); });
    return decodeURIComponent(atob(output.join("")));
}