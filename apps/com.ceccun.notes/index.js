const entry = () => {
    fetch("/apps/com.ceccun.notes/index.html")
    .then((response) => {
        if (response.status == 200) {
            response.text().then((app) => {
                var appElement = document.createElement("div");
                appElement.innerHTML = app;
                document.body.appendChild(appElement);
                showApp();
                loadNotes();
            });
        } else {

        }
    })
}

const loadNotes = () => {
    const ls = window.localStorage;
    fetch("https://api.ceccun.com/api/v1/notes", {
        "headers": { 
            "authorization": ls.getItem("token") 
        }
    }).then((response) => {
        if (response.status == 200) {
            response.json().then((notes) => {
                noteID = notes["content"];
                console.log(noteID);
                for (const item in noteID) {
                    const noteIdentity = noteID[item]
                    fetch(`https://api.ceccun.com/api/v1/notes/${noteIdentity}`, {
                        "headers": {
                             "authorization": ls.getItem("token") 
                        }
                    }).then((response) => {
                        if (response.status == 200) {
                            response.json().then((data) => {
                                console.log(data)
                                try {
                                    document.getElementsByClassName("skel-item-inner")[item].innerHTML = `<p>${data["content"]["note"]}</p>`
                                } catch (error) {
                                    var newElem = document.createElement("div");
                                    newElem.setAttribute("class", "skel-item");
                                    newElem.innerHTML = `<div class='skel-item-inner'><p>${data["content"]["note"]}</p></div>`;
                                    document.getElementsByClassName("ls-notes")[0].appendChild(newElem);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}