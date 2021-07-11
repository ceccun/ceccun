const signUp = (email, name, password) => {
  var key = Math.random();
  var encryptedName = encrypt(name, key);
  var encryptedKey = encrypt(key, password);
  sendToServer({ name: encryptedName, key: encryptedKey });
};

const getData = (password) => {
  getFromServer("abdauidaiud").then((data) => {
    var plainTextKey = decrypt(encryptedKey, password);
    var plainTextName = decrypt(encryptedName, plainTextKey);
  });
};

const changePassword = (oldPassword, newPassword) => {
  getFromServer("key").then((data) => {
    var oldPlainTextKey = decrypt(data.encryptedKey, oldPassword);
    var newPlainTextKey = encrypt(oldPlainTextKey, newPassword);
    sendToServer(newPlainTextKey);
  });
};
