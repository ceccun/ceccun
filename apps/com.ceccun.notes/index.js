var currentSection = "notes"
var batchNum = {
    "notes": 0,
    "flashcards": 0
}

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
    downloadNotesList(batchNum["notes"]);
}


const downloadNotesList = (batchNumber) => {
    const ls = window.localStorage;
    if (batchNum["notes"] != "fin") {
        fetch(`https://api.ceccun.com/api/v1/notes?batch=${batchNumber}`, {
            "headers": {
                "authorization": ls.getItem("token"),
            }
        })
        .then ((response) => {
            if (response.status == 200) {
                response.json().then((notesList) => {
                    notesListContents = notesList["content"];
                    console.log(notesListContents.length == 10);
                    if (notesListContents.length == 10) {
                        batchNum["notes"] += 1;
                        console.log(batchNum);
                    } else {
                        batchNum["notes"] = "fin";
                        console.log(batchNum);
                    }
                    var count = 0
                    for (const item in notesListContents) {

                        fetch(`https://api.ceccun.com/api/v1/notes/${notesListContents[item]}`, {
                            headers: {
                                "authorization": ls.getItem("token")
                            }
                        }).then((response) => {

                            if (response.status == 200) {

                                response.json()
                                .then((data) => {
                                    var noteContents = data["content"]["note"];
                                    if (noteContents.length >= 255) {
                                        noteContents = noteContents.substring(0, 255) + "..."
                                    }
                                    var newPElem = document.createElement('p');
                                    newPElem.innerText = noteContents;
                                    
                                    var innerElem = document.createElement("div");
                                    innerElem.setAttribute("class", "note-item-inner");
                                    innerElem.appendChild(newPElem);

                                    try {
                                        document.getElementsByClassName("loading-state")[item].innerHTML = "";
                                        document.getElementsByClassName("loading-state")[item].appendChild(innerElem);
                                        
                                    } catch (error) {
                                        var outerElem = document.createElement('div');
                                        outerElem.setAttribute("class", "note-item");
                                        outerElem.appendChild(innerElem);
                                        document.getElementsByClassName("ls-notes")[0].appendChild(outerElem);
                                        
                                    }
                                    console.log("hello")
                                    count += 1;
                                })
                            }
                        });

                    }

                    var countDetector = setInterval(() => {
                        if (count == notesListContents.length) {
                            if (batchNum["notes"] != "fin") {
                                var newSkel = document.createElement('skelNote');
                                var stateItems = document.getElementsByClassName("loading-state");
                                for (const item of stateItems) {
                                    item.setAttribute("class","note-item");
                                }
                                document.getElementsByClassName("ls-notes")[0].appendChild(newSkel);
                            }
                            clearInterval(countDetector);
                        }
                    }, 100);
                })
            }
        })
    }
}



const addInLoader = () => {
    const stillLoading = document.getElementsByClassName("loading-state");
    for (const loadingEL of stillLoading) {
        loadingEL.remove();
    }
    var loadingElem = document.createElement("skelNote");
    document.getElementsByClassName("ls-notes")[0].appendChild(loadingElem);
}

var justFiredScroll = 0;
var windowSize = 0;
document.addEventListener("scroll", (e) => {
    if (windowSize != document.body.scrollHeight) {
        justFiredScroll = 0;
        windowSize = document.body.scrollHeight;
    }
    console.log("yum")
    if (justFiredScroll == 0) {
        if ((document.body.scrollHeight - (window.innerHeight + window.scrollY)) < 190 ) {
            if (currentSection == "notes") {
                downloadNotesList(batchNum["notes"]);
            }
            justFiredScroll = 1;
        }
    }
})