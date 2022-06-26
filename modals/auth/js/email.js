async function getLayout() {
    let response = await fetch('/modals/auth/html/email.html');
    let emailLayout = await response.text();

    return emailLayout
}

async function getStyles() {

}

async function exec() {

}


return [
    getLayout,
    getStyles,
    exec
]