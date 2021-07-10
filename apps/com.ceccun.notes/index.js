var currentSection = "notes";
var currentNote = {
  note: null,
  loaded: 0,
  lastState: 0,
  ogState: 0,
  encrypted: 0,
  keychain: 0,
  passphrase: 0,
  unlockedKeychain: 0,
};
var batchNum = {
  notes: 0,
  flashcards: 0,
};

const entry = () => {
  fetch("/apps/com.ceccun.notes/strings.js").then((response) => {
    if (response.status == 200) {
      response.text().then((strings) => {
        var stringElements = document.createElement("script");
        stringElements.innerHTML = strings;
        document.body.appendChild(stringElements);
      });
    }
  });
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
          for (const item of notesListContents) {
            console.log(item);
            try {
              document
                .getElementsByClassName("loading-state")[0]
                .setAttribute("id", `notePreviewDiv_${item}`);
              document
                .getElementsByClassName("loading-state")[0]
                .setAttribute("class", "note-item");
            } catch (error) {
              var outerElem = document.createElement("div");
              var inner = document.createElement("div");
              inner.setAttribute("class", "note-item-inner");
              inner.innerHTML = `<div class='skel' style='width: 40%; height: 30px; margin-bottom: 10px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 100%; height: 15px;'></div> <div class='skel' style='width: 90%; height: 15px;'></div> <div class='skel' style='width: 20%; height: 15px;'></div>`;
              outerElem.setAttribute("class", "note-item");
              outerElem.setAttribute("id", `notePreviewDiv_${item}`);
              outerElem.appendChild(inner);
              document
                .getElementsByClassName("ls-notes-notes")[0]
                .appendChild(outerElem);
            }
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
                    document.getElementById(
                      `notePreviewDiv_${notesListContents[item]}`
                    ).innerHTML = "";
                    document
                      .getElementById(
                        `notePreviewDiv_${notesListContents[item]}`
                      )
                      .appendChild(innerElem);
                    document
                      .getElementById(
                        `notePreviewDiv_${notesListContents[item]}`
                      )
                      .setAttribute(
                        "onclick",
                        `openNotes("${notesListContents[item]}")`
                      );
                    document
                      .getElementById(
                        `notePreviewDiv_${notesListContents[item]}`
                      )
                      .setAttribute("class", "note-item selectable");
                  } catch (error) {
                    document
                      .getElementsByClassName("ls-notes-notes")[0]
                      .appendChild(
                        createPreview(
                          notesListContents[item],
                          data["content"]["preview"]
                        )
                      );
                  }
                  count += 1;
                });
              } else {
                document.getElementById(
                  `notePreviewDiv_${notesListContents[item]}`
                ).innerHTML = `<div class="note-item-inner">
                  <img style="display: inline-block; vertical-align: middle; height: 20px; filter: var(--invert-icon)" src='/images/alerttri.svg'/>
                  <p style="display: inline-block; margin: 0 0 0 10px; vertical-align: middle;">Could not load!</p>
                  </div>`;
                document
                  .getElementById(`notePreviewDiv_${notesListContents[item]}`)
                  .setAttribute("class", "note-item selectable");
                document
                  .getElementById(`notePreviewDiv_${notesListContents[item]}`)
                  .setAttribute(
                    "onclick",
                    `openNotes("${notesListContents[item]}")`
                  );
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
                  .getElementsByClassName("ls-notes-notes")[0]
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

const createPreview = (noteNum, notePreview) => {
  var pElem = document.createElement("p");
  pElem.innerText = notePreview;
  pElem.setAttribute("id", `notePreview_${noteNum}`);
  var innerElem = document.createElement("div");
  innerElem.setAttribute("class", "note-item-inner");
  innerElem.appendChild(pElem);
  var outerElem = document.createElement("div");
  outerElem.setAttribute("class", "note-item selectable");
  outerElem.setAttribute("onclick", `openNotes("${noteNum}")`);
  outerElem.setAttribute("id", `notePreviewDiv_${noteNum}`);
  outerElem.appendChild(innerElem);
  return outerElem;
};

const createNote = () => {
  const ls = window.localStorage;
  fetch(`https://api.ceccun.com/api/v1/notes`, {
    method: "POST",
    body: JSON.stringify({
      content: {
        note: `
        This is your new note on Ceccun Notes.
        <br>
        Ceccun Notes is designed to be:
        <ul>
          <li>Fast,</li>
          <li>easy</li>
          <li>and just awesome 😎.</li>
        </ul>
        <br>
        <img src='/images/promo/note-screenshot.png' /><br><br>
        Enjoy ヾ(•ω•')o`,
        preview: "Unedited Note",
        encrypted: 0,
        keychain: 0,
        attachments: [],
      },
    }),
    headers: {
      authorization: ls.getItem("token"),
    },
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        document
          .getElementsByClassName("ls-notes-notes")[0]
          .prepend(createPreview(data["content"], "New Note"));
        openNotes(data["content"]);
      });
    }
  });
};

const openNotes = (noteNumber) => {
  const ls = window.localStorage;

  var noteTypeElem = document.createElement("div");
  noteTypeElem.setAttribute("class", "write-new-note-screen current-screen");
  noteTypeElem.innerHTML = `
       <div class="screen-background"></div>
    <div class="popup">
        <div class="new-note-header">
            <div onclick="saveAndCloseNote()">
                <img src="/images/chevron.svg" />
                <trn>
                    <div>
                        <p>Close Note</p>
                    </div>
                    <div></div>
                </trn>
            </div>
        </div>
        <div class="note-outer">
            <div class="note-typing" contenteditable="">
                <skel />
            </div>
        </div>
        <div class="note-footer">
            <div class="note-footer-image-button">
                <img src="/images/image.svg" />
                <trn>
                    <div>
                        <p>Media</p>
                    </div>
                    <div></div>
                </trn>
            </div>

            <div onclick="encryptNote()" class="note-footer-encrypt-button">
                <img src="/images/unlocked.svg" />
                <trn>
                    <div>
                        <p>Encryption</p>
                    </div>
                    <div></div>
                </trn>
            </div>

            <div onclick="deleteNote()" class="note-footer-delete-button">
                <img src="/images/delete.svg" />
                <trn>
                    <div>
                        <p>Remove</p>
                    </div>
                    <div></div>
                </trn>
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
          encrypted: data["content"]["encrypted"],
          keychain: data["content"]["keychain"],
        };
        if (currentNote["encrypted"] != 0) {
          encryptNote(3);
        }
        document
          .getElementsByClassName("note-typing")[0]
          .addEventListener("keyup", reassessInput);
      });
    } else {
      document.getElementsByClassName(
        "note-typing"
      )[0].innerHTML = `<p style="text-align: center;">Something went wrong.</p><button style="margin: auto;" onclick="document.getElementsByClassName('current-screen')[0].remove();">Close</button>`;
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
      if (currentNote["encrypted"] == 0) {
        currentNote["lastState"] =
          document.getElementsByClassName("note-typing")[0].innerHTML;
        currentNote["preview"] = document
          .getElementsByClassName("note-typing")[0]
          .innerText.substring(0, 256);
        lastState = currentNote["lastState"];
        ogState = currentNote["ogState"];
      } else {
        currentNote["lastState"] = encrypt(
          document.getElementsByClassName("note-typing")[0].innerHTML,
          currentNote["keychain"]
        );
        currentNote["preview"] = `Encrypted Note`;
        lastState = currentNote["lastState"];
        ogState = currentNote["ogState"];
      }

      if (currentNote["loaded"] == 1) {
        if (lastState != ogState) {
          fetch(`https://api.ceccun.com/api/v1/notes/${currentNote["note"]}`, {
            method: "POST",
            body: JSON.stringify({
              note: lastState,
              preview: currentNote["preview"],
              attachments: [],
              encrypted: currentNote["encrypted"],
              keychain: currentNote["keychain"],
            }),
            headers: {
              authorization: ls.getItem("token"),
            },
          }).then((response) => {
            if (response.status == 200) {
              response.json().then((data) => {
                currentNote["ogState"] = lastState;
                document.getElementById(
                  `notePreview_${currentNote["note"]}`
                ).innerText = currentNote["preview"];
                if (action == "closing") {
                  if (
                    document.getElementsByClassName("note-typing").innerText ==
                    ""
                  ) {
                    deleteNote(2);
                  }
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
    // console.error(error);
  }
};

const deleteNote = (noteConfirmation = 0) => {
  var ls = window.localStorage;
  if (currentNote["loaded"] == 1) {
    if (noteConfirmation == 0) {
      var newElem = document.createElement("div");
      newElem.innerHTML = `<div class="screen-background"></div>
        <div class="popup">
            <div>
            <h2>Delete Note?</h2>
            <p>Deleting this note will remove it off all connected devices.</p>
            <button onclick="deleteNote(1)">Cancel</button>
            <button onclick="deleteNote(2)">Delete</button>
            </div>
        </div>`;
      newElem.setAttribute("class", "delete-note");
      document.body.appendChild(newElem);
    }
    if (noteConfirmation == 1) {
      document.getElementsByClassName("delete-note")[0].remove();
    }
    if (noteConfirmation == 2) {
      fetch(`https://api.ceccun.com/api/v1/notes/${currentNote["note"]}`, {
        method: "POST",
        body: JSON.stringify({
          action: "delete",
        }),
        headers: {
          authorization: ls.getItem("token"),
        },
      }).then((response) => {
        if (response.status == 200) {
          document.getElementsByClassName("ls-notes-notes")[0].innerHTML = ``;
          batchNum["notes"] = 0;
          try {
            document
              .getElementsByClassName("write-new-note-screen")[0]
              .remove();
          } catch (error) {}
          loadNotes();
        } else {
          alert("Failed to delete note!");
        }
      });
      document.getElementsByClassName("delete-note")[0].remove();
    }
  }
};

const encryptNote = (encryptNote = 0) => {
  if (currentNote["loaded"] == 1) {
    if (encryptNote == 0) {
      var newElem = document.createElement("div");
      newElem.innerHTML = `<div class="screen-background"></div>
        <div class="popup">
            <div>
            <h2>Encrypt Note?</h2>
            <p>Encrypt this note using a set passphrase.</p>
            <input class="encrypt-note-input" />
            <button onclick="deleteNote(1)">Cancel</button>
            <button onclick="encryptNote(2)">Delete</button>
            </div>
        </div>`;
      newElem.setAttribute("class", "delete-note");
      document.body.appendChild(newElem);
    }

    if (encryptNote == 2) {
      var keychain = Math.random();
      currentNote["keychain"] = encrypt(
        keychain,
        document.getElementsByClassName("encrypt-note-input")[0].value
      );
      currentNote["unlockedKeychain"] = keychain;
      currentNote["encrypted"] = 1;
      document.getElementsByClassName("delete-note")[0].remove();
    }

    if (encryptNote == 3) {
      var newElem = document.createElement("div");
      newElem.innerHTML = `<div class="screen-background"></div>
        <div class="popup">
            <div>
            <h2>Decrypt Note</h2>
            <p>Break this note's encryption by entering the passphrase.</p>
            <input class="encrypt-note-input" />
            <button onclick="deleteNote(1)">Cancel</button>
            <button onclick="encryptNote(4)">Break</button>
            </div>
        </div>`;
      newElem.setAttribute("class", "delete-note");
      document.body.appendChild(newElem);
    }

    if (encryptNote == 4) {
      var passphrase =
        document.getElementsByClassName("encrypt-note-input")[0].value;

      currentNote["unlockedKeychain"] = decrypt(
        currentNote["keychain"],
        passphrase
      );
      document.getElementsByClassName("delete-note")[0].remove();
      console.log(currentNote["ogState"]);
      console.log(
        decrypt(currentNote["ogState"], currentNote["unlockedKeychain"])
      );
      document.getElementsByClassName("note-typing")[0].innerHTML = decrypt(
        currentNote["ogState"],
        currentNote["unlockedKeychain"]
      );
    }
  }
};
