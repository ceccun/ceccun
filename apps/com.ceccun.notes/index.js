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
    downloadNotesList(0)
}


const downloadNotesList = (batchNum) => {
    const ls = window.localStorage;
    fetch(`https://api.ceccun.com/api/v1/notes?batch=${batchNum}`, {
        "headers": {
            "authorization": ls.getItem("token"),
        }
    })
    .then ((response) => {
        if (response.status == 200) {
            response.json().then((notesList) => {
                notesListContents = notesList["content"];
                var count = 0
                for (const item of notesListContents) {

                    fetch(`https://api.ceccun.com/api/v1/notes/${item}`, {
                        headers: {
                            "authorization": ls.getItem("token")
                        }
                    }).then((response) => {
                        
                    })
                }
            })
        }
    })
}


const addInLoader = () => {
    const stillLoading = document.getElementsByClassName("loading-state");
    for (const loadingEL of stillLoading) {
        loadingEL.remove();
    }
    var loadingElem = document.createElement("skelNote");
    document.getElementsByClassName("ls-notes")[0].appendChild(loadingElem);
}