const entry = () => {
    fetch("/apps/com.ceccun.notes/index.html")
    .then((response) => {
        if (response.status == 200) {
            response.text().then((app) => {
                var appElement = document.createElement("div");
                appElement.innerHTML = app;
                document.body.appendChild(appElement);
                showApp();
            });
        } else {

        }
    })
}