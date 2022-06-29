async function getLayout() {
    let response = await fetch('/modals/auth/html/email.html');
    let emailLayout = await response.text();

    return emailLayout
}

async function getStyles() {

}

async function exec() {
    const nextbutton = document.getElementById("r-next-button");
    nextbutton.className = "button shown";
    nextbutton.addEventListener('click', nextBtn);

    document.getElementsByClassName("modal-bottom-controls")[0].className = "modal-bottom-controls modal-controls controls-shown";


}

function nextBtn() {
    unloadEvent();
    goTo(2);
}

function unloadEvent() {
    const nextbutton = document.getElementById("r-next-button");
    nextbutton.removeEventListener('click', nextBtn);
    nextbutton.className = "button";

    document.getElementsByClassName("modal-bottom-controls")[0].className = "modal-bottom-controls modal-controls";
}

return [
    getLayout,
    getStyles,
    exec
]