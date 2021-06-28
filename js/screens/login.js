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

const loginScrLogin = () => {
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    fetch("https://api.ceccun.com/api/v1/login", {
        "body": JSON.stringify({
            "email": email,
            "password": password
        })
    })
}