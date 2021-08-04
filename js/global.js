var flsestrings = {};
var notification = 0;

var date = new Date();
flsestrings["copyright"] = {
  default: `© Ceccun ${date.getUTCFullYear().toString()} `,
};
flsestrings["nointernet"] = {
  default: "No Internet Connection.",
  ja: "インターネット接続はありません。",
  es: "Sin conexión a Internet",
  fr: "Pas de connexion Internet.",
  it: "Nessuna connessione internet.",
  fi: "Ei Internet-yhteyttä.",
};
flsestrings["fieldrequired"] = {
  default: "Field cannot be left empty.",
  it: "Il campo di inserimento non può essere lasciato vuoto.",
  fi: "Kenttää ei voi jättää tyhjäksi.",
};

var networkConnection = false;

const checkNetConnection = () => {
  try {
    fetch("https://api.ceccun.com/cdynamic/captive")
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            if (data["error"] == "1") {
              networkConnection = true;
              if (data["signal"] == "ratelimit") {
                // sendNotification(
                //   "Network Manager",
                //   "You are being ratelimited."
                // );
              }
              return;
            } else {
              networkConnection = false;
              return;
            }
          });
        } else {
          networkConnection = false;
          return;
        }
      })
      .catch(() => {
        networkConnection = false;
        return;
      });
  } catch (error) {
    networkConnection = false;
  }
};

checkNetConnection();

setInterval(() => {
  checkNetConnection();
}, 5000);

const include = (filename) => {
  var head = document.getElementsByTagName("head")[0];

  var script = document.createElement("script");
  script.src = filename;
  script.type = "text/javascript";

  head.appendChild(script);
};

const sendNotification = (appName, content, timeout = 5000) => {
  const notificationElem = document.createElement("div");
  const random = btoa(Math.random());
  notificationElem.setAttribute("class", "notification");
  notificationElem.setAttribute("id", random);
  notificationElem.innerHTML = `
        <div style="scroll-snap-align: end" class="notification-padding"></div>
        <div class="notification-inner">
            <div class="notification-inner-inner">
                <h3>${appName}</h3>
                <p>${content}</p>
            </div>
        </div>
        <div class="notification-padding"></div>
        <div class="notification-padding"></div>`;
  document.body.append(notificationElem);

  document.getElementById(random).addEventListener("scroll", (e) => {
    const scroll = document.getElementById(random).scrollTop;
    if (scroll > 179) {
      document.getElementById(random).remove();
    }
  });

  setTimeout(() => {
    document
      .getElementById(random)
      .setAttribute("class", "notification notification-flyout");

    setTimeout(() => {
      document.getElementById(random).remove();
    }, 400);
  }, timeout);
};
