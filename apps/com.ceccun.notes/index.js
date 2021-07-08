var currentSection = "notes";
var currentNote = {
  note: null,
  loaded: 0,
  lastState: 0,
  ogState: 0,
};
var batchNum = {
  notes: 0,
  flashcards: 0,
};

const entry = () => {
  fetch("/apps/com.ceccun.notes/index.html").then((response) => {
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
  });
};

const saveAndCloseNote = () => {
  saveNote(
    document.getElementsByClassName("note-typing")[0].innerHTML,
    "closing"
  );
};

const loadNotes = () => {
  downloadNotesList(batchNum["notes"]);
};

const downloadNotesList = (batchNumber) => {
  const ls = window.localStorage;
  if (batchNum["notes"] != "fin") {
    fetch(`https://api.ceccun.com/api/v1/notes?batch=${batchNumber}`, {
      headers: {
        authorization: ls.getItem("token"),
      },
    }).then((response) => {
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
          var count = 0;
          for (const item in notesListContents) {
            fetch(
              `https://api.ceccun.com/api/v1/notes/${notesListContents[item]}`,
              {
                headers: {
                  authorization: ls.getItem("token"),
                },
              }
            ).then((response) => {
              if (response.status == 200) {
                response.json().then((data) => {
                  var noteContents = data["content"]["preview"];
                  if (noteContents.length >= 255) {
                    noteContents = noteContents.substring(0, 255) + "...";
                  }
                  var newPElem = document.createElement("p");
                  newPElem.setAttribute(
                    "id",
                    `notePreview_${notesListContents[item]}`
                  );
                  newPElem.innerText = noteContents;

                  var innerElem = document.createElement("div");
                  innerElem.setAttribute("class", "note-item-inner");
                  innerElem.appendChild(newPElem);

                  try {
                    document.getElementsByClassName(
                      "loading-state"
                    )[0].innerHTML = "";
                    document
                      .getElementsByClassName("loading-state")[0]
                      .appendChild(innerElem);
                    document
                      .getElementsByClassName("loading-state")[0]
                      .setAttribute(
                        "onclick",
                        `openNotes("${notesListContents[item]}")`
                      );
                    document
                      .getElementsByClassName("loading-state")[0]
                      .setAttribute("class", "note-item selectable");
                  } catch (error) {
                    var outerElem = document.createElement("div");
                    outerElem.setAttribute("class", "note-item selectable");
                    outerElem.setAttribute(
                      "onclick",
                      `openNotes("${notesListContents[item]}")`
                    );
                    outerElem.appendChild(innerElem);
                    document
                      .getElementsByClassName("ls-notes")[0]
                      .appendChild(outerElem);
                  }
                  count += 1;
                });
              }
            });
          }

          var countDetector = setInterval(() => {
            if (count == notesListContents.length) {
              if (batchNum["notes"] != "fin") {
                var newSkel = document.createElement("skelNote");
                var stateItems =
                  document.getElementsByClassName("loading-state");
                for (const item of stateItems) {
                  item.setAttribute("class", "note-item");
                }
                document
                  .getElementsByClassName("ls-notes")[0]
                  .appendChild(newSkel);
              }
              clearInterval(countDetector);
            }
          }, 100);
        });
      }
    });
  }
};

const addInLoader = () => {
  const stillLoading = document.getElementsByClassName("loading-state");
  for (const loadingEL of stillLoading) {
    loadingEL.remove();
  }
  var loadingElem = document.createElement("skelNote");
  document.getElementsByClassName("ls-notes")[0].appendChild(loadingElem);
};

var justFiredScroll = 0;
var windowSize = 0;
document.addEventListener("scroll", (e) => {
  if (windowSize != document.body.scrollHeight) {
    justFiredScroll = 0;
    windowSize = document.body.scrollHeight;
  }
  console.log("yum");
  if (justFiredScroll == 0) {
    if (
      document.body.scrollHeight - (window.innerHeight + window.scrollY) <
      190
    ) {
      if (currentSection == "notes") {
        downloadNotesList(batchNum["notes"]);
      }
      justFiredScroll = 1;
    }
  }
});

const openNotes = (noteNumber) => {
  const ls = window.localStorage;

  var noteTypeElem = document.createElement("div");
  noteTypeElem.setAttribute("class", "write-new-note-screen current-screen");
  noteTypeElem.innerHTML = `
    <div class="screen-background"></div>
    <div class="popup">
        <div class="new-note-header">
            <div onclick="saveAndCloseNote()">
                <img src="/images/chevron.svg"/>
                <trn>
                    <div><p>Close Note</p></div>
                    <div></div>
                </trn>
            </div>
        </div>
        <div class="note-outer">
            <div class="note-typing">
                <skel />
            </div>
        </div>
    </div>`;
  document.body.appendChild(noteTypeElem);
  document
    .getElementsByClassName("screen-background")[0]
    .addEventListener("click", saveAndCloseNote);
  currentNote = {
    note: noteNumber,
    loaded: 0,
    ogState: 0,
    lastState: 0,
    preview: 0,
  };
  fetch(`https://api.ceccun.com/api/v1/notes/${noteNumber}`, {
    headers: {
      authorization: ls.getItem("token"),
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        document.getElementsByClassName("note-typing")[0].innerHTML =
          data["content"]["note"];
        document
          .getElementsByClassName("note-typing")[0]
          .setAttribute("contenteditable", "");
        currentNote = {
          note: noteNumber,
          loaded: 1,
          ogState: data["content"]["note"],
          lastState: data["content"]["note"],
          preview: data["content"]["preview"],
        };
        document
          .getElementsByClassName("note-typing")[0]
          .addEventListener("keyup", reassessInput);
      });
    }
  });
};

const reassessInput = () => {
  var noteSteadiness =
    document.getElementsByClassName("note-typing")[0].innerHTML;
  setTimeout(() => {
    saveNote(noteSteadiness);
  }, 1500);
};

const saveNote = (noteSteadiness, action = "general") => {
  const ls = window.localStorage;
  try {
    if (
      noteSteadiness ==
      document.getElementsByClassName("note-typing")[0].innerHTML
    ) {
      currentNote["lastState"] =
        document.getElementsByClassName("note-typing")[0].innerHTML;
      currentNote["preview"] =
        document.getElementsByClassName("note-typing")[0].innerText;
      lastState = currentNote["lastState"];
      ogState = currentNote["ogState"];

      if (currentNote["loaded"] == 1) {
        if (lastState != ogState) {
          if (lastState.startsWith(ogState)) {
            newNote = lastState.substring(ogState.length, lastState.length);
            fetch(
              `https://api.ceccun.com/api/v1/notes/${currentNote["note"]}`,
              {
                method: "POST",
                body: JSON.stringify({
                  action: {
                    type: "append",
                    target: "note",
                  },
                  note: newNote,
                }),
                headers: {
                  authorization: ls.getItem("token"),
                },
              }
            ).then((response) => {
              if (response.status == 200) {
                response.json().then((data) => {
                  currentNote["ogState"] = lastState;
                });
              }
            });
          } else {
            fetch(
              `https://api.ceccun.com/api/v1/notes/${currentNote["note"]}`,
              {
                method: "POST",
                body: JSON.stringify({
                  action: {
                    type: "replace",
                    target: "note",
                  },
                  note: lastState,
                }),
                headers: {
                  authorization: ls.getItem("token"),
                },
              }
            ).then((response) => {
              if (response.status == 200) {
                response.json().then((data) => {
                  currentNote["ogState"] = lastState;
                });
              }
            });
          }

          fetch(`https://api.ceccun.com/api/v1/notes/${currentNote["note"]}`, {
            method: "POST",
            body: JSON.stringify({
              action: {
                type: "replace",
                target: "preview",
              },
              preview: currentNote["preview"].substring(0, 257),
            }),
            headers: {
              authorization: ls.getItem("token"),
            },
          }).then((response) => {
            if (response.status == 200) {
              response.json().then((data) => {
                document.getElementById(
                  `notePreview_${currentNote["note"]}`
                ).innerText = currentNote["preview"];
                if (action == "closing") {
                  document
                    .getElementsByClassName("write-new-note-screen")[0]
                    .remove();
                }
              });
            }
          });
        } else {
          if (action == "closing") {
            document
              .getElementsByClassName("write-new-note-screen")[0]
              .remove();
          }
        }
      }
    }
  } catch (error) {
    //   console.error(error);
  }
};
