async function getLayout() {
    let response = await fetch('/modals/auth/html/password.html');
    let passwordLayout = await response.text();

    return passwordLayout
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