// Ceccun Cryptographic Service

const crypto_sourceMap =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.!~*'() =";

const encrypt = (data, key) => {
  const sourceMapSplit = crypto_sourceMap.split("");
  const keyB64 = btoa(encodeURIComponent(key));

  var keyPairTable = generateKeyPair(keyB64);

  const dataSplit = btoa(encodeURIComponent(data)).split("");

  var output = [];
  for (item of dataSplit) {
    output.push(keyPairTable[item]);
  }
  return output.join(":");
};

const decrypt = (data, key) => {
  const sourceMapSplit = crypto_sourceMap.split("");

  const keyB64 = btoa(encodeURIComponent(key));
  const keySplit = keyB64.split("");

  var keyPairTable = generateKeyPair(keyB64);

  const dataSplit = data.split(":");

  var output = [];
  for (item of dataSplit) {
    output.push(getKeyByValue(keyPairTable, item));
  }
  var outputJoined = output.join("");
  return decodeURIComponent(atob(outputJoined));
};

encrypt(
  "abcdefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.!~*'()%",
  "hello"
);

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function generateKeyPair(key) {
  var keyPairTable = {};
  var keySplit = key.split("");
  var letterNumberUsage = {};
  var sourceMapSplit = crypto_sourceMap.split("");

  for (item in sourceMapSplit) {
    var lNU = letterNumberUsage[keySplit[item]] + 1;
    var itemDivKey = item / keySplit.length;
    var keystringNumber = Math.floor(
      (item / keySplit.length - Math.floor(item / keySplit.length)) *
        keySplit.length
    );

    if (letterNumberUsage[keySplit[keystringNumber]] == undefined) {
      letterNumberUsage[keySplit[keystringNumber]] = 0;
    }
    keyPairTable[sourceMapSplit[item]] = `${keySplit[keystringNumber]}-${
      letterNumberUsage[keySplit[keystringNumber]]
    }`;

    letterNumberUsage[keySplit[keystringNumber]] += 1;
  }

  return keyPairTable;
}
