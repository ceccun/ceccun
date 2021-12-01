document.title = "Ceccun Mental Health";

const entry = () => {
    fetch("/mhi/content.html").then((response) => {
        if (response.status == 200) {
            response.text().then((data) => {
                var appElement = document.createElement("div");
                appElement.innerHTML = data;
                document.body.appendChild(appElement);
                setTimeout(() => { 
                    showApp();
                    setTimeout(() => {
                        document.getElementsByClassName("grid")[0].setAttribute("style", "")
                        document.getElementsByClassName("skelGrid")[0].setAttribute("style", "display: none")
                    }, 700)
                }, 700)
            })
        }
    })
};
  