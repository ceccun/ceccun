flsestrings["hello"] = {
  default: "Hello,",
  ja: "こんにちは、",
  fr: "Salut,",
  es: "Hola,",
  it: "Ciao,",
  fi: "Hei,",
};
flsestrings["signin"] = {
  default: "Sign In",
  ja: "サインイン",
  fr: "S'identifier",
  es: "Iniciar Sesión",
  it: "Login",
  fi: "Kirjaudu sisään",
};
flsestrings["emailadd"] = {
  default: "Email Address",
  ja: "Eメール",
  fr: "E-mail",
  es: "Correo electrónico",
  it: "Indirizzo e-mail",
  fi: "Sähköpostiosoite",
};
flsestrings["password"] = {
  default: "Password",
  ja: "パスワード",
  fr: "Mot de passe",
  es: "Contraseña",
  it: "Parola d'ordine",
  fi: "Salasana",
};
flsestrings["incorrect"] = {
  default: "Sorry! That didn't work.",
  ja: "ごめんなさい！ クレデンシャルが正しくありません。",
  fr: "Pardon! Identifiants incorrects.",
  es: "Contraseña o correo electrónico incorrecto.",
  it: "Scusa! Non ha funzionato. ",
  fi: "Anteeksi! Tämä ei toiminut."
};

let appID = new URL(window.location).searchParams.get("appID");

const loginScrLogin = () => {
  var error = 0;
  resetAll();

  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;
  if (email.trim().length == 0) {
    errorForm("error-msg-no-email");
    document.getElementById("email-input").setAttribute("class", "error-input");
    error = 1;
  }
  if (password.trim().length == 0) {
    errorForm("error-msg-no-password");
    document
      .getElementById("password-input")
      .setAttribute("class", "error-input");
    error = 1;
  }
  console.log(networkConnection);
  if (networkConnection == false) {
    document.getElementById("login-btn").setAttribute("style", "z-index: 1;");
    document
      .getElementById("error-msg-no-work")
      .setAttribute("flsestring", "nointernet");
    errorForm("error-msg-no-work");
    error = 1;
  } else {
    document
      .getElementById("error-msg-no-work")
      .setAttribute("flsestring", "incorrect");
  }
  if (error == 1) {
    return;
  }
  document
    .getElementById("login-btn")
    .setAttribute(
      "style",
      "background-color: var(--button-unavailable); transition: none;"
    );

  if (appID == null) {
    userLogin(email, password);
  } else {
    appLogin(email, password);
  }
};

const userLogin = (email, password) => {
  fetch("https://api.ceccun.com/api/v1/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        if (data["error"] == "1") {
          const ls = window.localStorage;
          ls.setItem("token", data["authentication"]);
          window.location.href = `/screens/loginaf.html`;
        } else {
          document
            .getElementById("login-btn")
            .setAttribute("style", "z-index: 1;");
          document
            .getElementById("error-msg-no-work")
            .setAttribute("style", "");
          document
            .getElementById("error-msg-no-work")
            .setAttribute("class", "error-type");
        }
      });
    }
  });
};

const appLogin = (email, password) => {
  fetch("https://api.ceccun.com/api/v1/apps/get-token", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
      app: atob(appID),
    }),
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        if (data["error"] == "1") {
          window.location.href = `/screens/loginaf.html?token=${btoa(
            data["token"]
          )}&app=${appID}&redirect=${btoa(data["redirect"])}`;
        } else {
          document
            .getElementById("login-btn")
            .setAttribute("style", "z-index: 1;");
          document
            .getElementById("error-msg-no-work")
            .setAttribute("style", "");
          document
            .getElementById("error-msg-no-work")
            .setAttribute("class", "error-type");
        }
      });
    }
  });
};

const errorForm = (errorElement) => {
  document.getElementById(errorElement).setAttribute("style", "");
  document.getElementById(errorElement).setAttribute("class", "error-type");
};

const resetAll = () => {
  document.getElementById("error-msg-no-email").setAttribute("class", "");
  document
    .getElementById("error-msg-no-email")
    .setAttribute("style", "display: none;");
  document.getElementById("email-input").setAttribute("class", "");

  document.getElementById("error-msg-no-password").setAttribute("class", "");
  document
    .getElementById("error-msg-no-password")
    .setAttribute("style", "display: none;");
  document.getElementById("password-input").setAttribute("class", "");

  document.getElementById("error-msg-no-work").setAttribute("class", "");
  document
    .getElementById("error-msg-no-work")
    .setAttribute("style", "display: none;");
  document
    .getElementById("error-msg-no-work")
    .setAttribute("flsestring", "incorrect");
};

const loginError = (error) => {
  document.getElementById("");
};
