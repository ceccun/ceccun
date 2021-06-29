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
flsestrings["fieldrequired"] = {
    "default": "Field cannot be left empty.",
    "it": "Il campo di inserimento non può essere lasciato vuoto."
}

var networkConnection = false;

const checkNetConnection = () => {
    try{
        fetch("https://api.ceccun.com/cdynamic/captive")
        .then((response) => {

            if (response.status == 200) {
                response.json().then((data) => {
                    if (data["error"] == "1") {
                        networkConnection = true;
                        return;
                    } else {
                        networkConnection = false;
                        return;
                    }
                })
            } else {
                networkConnection = false;
                return;
            }
        }).catch(() => {
            networkConnection = false;
            return;
        })
    } catch(error) {
        networkConnection = false;
    }
}

checkNetConnection();

setInterval(() => {
        checkNetConnection();
    }, 5000);
