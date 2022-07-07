async function getLayout() {
    let response = await fetch('/modals/auth/html/email.html');
    let emailLayout = await response.text();

    return emailLayout
}

async function getStyles() {

}

async function exec() {
    globalVariable["authenticate"] = (token) => {
        const ls = window.localStorage;
        ls.setItem("auth", token);
        let next = new URL(window.location).searchParams.get("next");
        if (next != null) {
            next = atob(next);
            window.location.href = next;
        } else{
            window.location.href = '/';
        }
    }
    const nextbutton = document.getElementById("r-next-button");
    nextbutton.className = "button shown";
    nextbutton.addEventListener('click', nextBtn);

    document.getElementsByClassName("modal-bottom-controls")[0].className = "modal-bottom-controls modal-controls controls-shown";


}

function nextBtn() {
    const email = document.getElementById("emailbox").value;
    if (validateEmail(email)) {
        const passwordmgr = document.getElementById("passmanagercatcher");
        if (globalVariable["autofill"] != false) {
            if (passwordmgr.value.trim() != "") {
                unloadEvent();
                goTo(3);
            } else {
                unloadEvent();
                goTo(2);
            }
        } else {
            try { document.getElementById("passwordmgr.js").remove(); } catch(err) {};
            unloadEvent();
            goTo(2);
        }
    } else {
        const msg = document.getElementById("enteremailmsg");
        msg.innerText = "Enter a valid email address";
        msg.style.color = "red";
    }
}

function unloadEvent() {
    const nextbutton = document.getElementById("r-next-button");
    nextbutton.removeEventListener('click', nextBtn);
    nextbutton.className = "button";

    document.getElementsByClassName("modal-bottom-controls")[0].className = "modal-bottom-controls modal-controls";
}

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

return [
    getLayout,
    getStyles,
    exec
]