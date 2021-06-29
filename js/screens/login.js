flsestrings["hello"] = {
    "default": "Hello,",
    "ja": "こんにちは、",
    "fr": "Salut,",
    "es": "Hola,",
    "it": "Ciao,"
}
flsestrings["signin"] = {
    "default": "Sign In",
    "ja": "サインイン",
    "fr": "S'identifier",
    "es": "Iniciar Sesión",
    "it": "Login"
};
flsestrings["emailadd"] = {
    "default": "Email Address",
    "ja": "Eメール",
    "fr": "E-mail",
    "es": "Correo electrónico",
    "it": "Indirizzo e-mail"
};
flsestrings["password"] = {
    "default": "Password",
    "ja": "パスワード",
    "fr": "Mot de passe",
    "es": "Contraseña",
    "it": "Parola d'ordine"
}
flsestrings["incorrect"] = {
    "default": "Sorry! That didn't work.",
    "ja": "ごめんなさい！ クレデンシャルが正しくありません。",
    "fr": "Pardon! Identifiants incorrects.",
    "es": "Contraseña o correo electrónico incorrecto.",
    "it": "Scusa! Non ha funzionato. "
}

let redirect = new URL(window.location).searchParams.get("redirect");

const loginScrLogin = () => {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    document.getElementById("login-btn").setAttribute("style", "background-color: var(--button-unavailable); transition: none;");
    fetch("https://api.ceccun.com/api/v1/login", {
        "method": "POST",
        "body": JSON.stringify({
            "email": email,
            "password": password
        })
    }).then((response) => {

        if (response.status == 200) {
            response.json().then((data) => {
                if (data["error"] == "1") {
                    const ls = window.localStorage;
                    ls.setItem("authenticationToken", data["authentication"]);
                    window.location.href = `/screens/loginaf.html?redirect=${atob(redirect)}`
                } else {
                    document.getElementById("login-btn").setAttribute("style", "z-index: 1;");
                    document.getElementById("error-msg-no-work").setAttribute("style", "");
                    document.getElementById("error-msg-no-work").setAttribute("class", "error-type");
                }
            })
        }
    })
}

const loginError = (error) => {
    document.getElementById("")
}
