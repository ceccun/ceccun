var flsestrings = {};

var date = new Date();
flsestrings["copyright"] = {
    "default": `© Fivnex, LLC ${date.getUTCFullYear().toString()} `,
}
flsestrings["nointernet"] = {
    "default": "No Internet Connection.",
    "ja": "インターネット接続はありません。",
    "es": "Sin conexión a Internet",
    "fr": "Pas de connexion Internet.",
    "it": "Nessuna connessione internet."
}

const checkNetwork = () => {
    const networkRequest = new XMLHttpRequest();
    networkRequest.open("GET","https://api.ceccun.com/cdynamic/captive", async=false);
    networkRequest.onreadystatechange = function (e) {
        if ((this.status == 200) && (this.readyState == 4)) {
            try{
            response = JSON.parse(this.responseText);
            if (response["error"] == "1"){
                if ("content" in response) {
                    return true;
                }
            }
            }
            catch (error) {
                return false;
            }
        }
    }
}