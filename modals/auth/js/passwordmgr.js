async function getLayout() {
    let response = await fetch('/modals/auth/html/passwordmgr.html');
    let passwordmgrLayout = await response.text();

    return passwordmgrLayout
}

async function getStyles() {

}

async function exec() {

    const nextbutton = document.getElementById("r-next-button");
    nextbutton.className = "button shown";
    nextbutton.addEventListener('click', nextBtn);

    const backbutton = document.getElementById("l-back-button");
    backbutton.className = "button shown";
    backbutton.addEventListener('click', backBtn);

    document.getElementsByClassName("modal-top-controls")[0].className = "modal-top-controls modal-controls controls-shown";
    document.getElementsByClassName("modal-bottom-controls")[0].className = "modal-bottom-controls modal-controls controls-shown";

}

function backBtn() {
    globalVariable["autofill"] = false;
    unloadEvent();
    goTo(1, false);
}

function nextBtn() {
    unloadEvent();
    goTo(0);
}

function unloadEvent() {
    const nextbutton = document.getElementById("r-next-button");
    nextbutton.className = "button";
    nextbutton.removeEventListener('click', nextBtn);

    const backbutton = document.getElementById("l-back-button");
    backbutton.className = "button";
    backbutton.removeEventListener('click', backBtn);

    document.getElementsByClassName("modal-top-controls")[0].className = "modal-top-controls modal-controls controls-hidden";
    document.getElementsByClassName("modal-bottom-controls")[0].className = "modal-bottom-controls modal-controls controls-hidden";

}



return [
    getLayout,
    getStyles,
    exec
]