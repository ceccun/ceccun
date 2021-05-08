let sessionVariables = {};

const virginSettings = {
    "stackAppEntry": "/apps/home",
    "setupFinished": true,
    "lastKnownVer": "1"
}

const setupEnvironment = (debug) => {
    const DateHandler = new Date;
    const encKey = (DateHandler.getTime() + Math.random()).toString()
    const secureID = encrypt(Math.random().toString(), encKey);

    let localStorageHandler = window.localStorage;
    if (localStorageHandler.getItem("ceccunENV_settings") == null) {
        localStorageHandler.setItem(
            "ceccunENV_settings", JSON.stringify(virginSettings)
            );
    }
    let mainApp = document.createElement("div");
    mainApp.setAttribute("id","mainAppFS");
    document.body.appendChild(mainApp);
    console.log(localStorageHandler.getItem("ceccunENV_settings"));
    launchApp("/apps/home");
}

const errHandler = (error, type) => { 
    let localStorageHandler = window.localStorage;
    if (localStorageHandler.getItem("ceccunENV_clientMode") == "prod") {
        return;
    } else { 
        if (type == "error") console.error(error);
        if (type == "message") console.log(error);
        if (type == "warning") console.warn(error);
    }
}

const checkSecureKey = (keyID) => {
    console.log("hiddd");
    if (secureID == keyID) {
        return true;
    } else {
        return false;
    }
}

const launchApp = (appEntry) => {
    fetch(`${appEntry}/manifest.json`, { importance: "high" })
    .then((response) => {
        if (response.status == 200) {
            response.json()
            .then((data) => {
                const entry = data["entryPoint"];
                let newElem = document.createElement("script");
                newElem.src = `${appEntry}/${entry}`;
                newElem.setAttribute("id", data["componentID"]);
                document.body.appendChild(newElem);
            })
        } else { 
            errHandler(response.status, "error");
        }
    })
}