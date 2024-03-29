include("js/marked.js");

document.title = "Ceccun Notes";

var currentSection = "notes";
var importedScripts = [];
var currentNote = {
  note: null,
  loaded: 0,
  lastState: 0,
  ogState: 0,
  encrypted: 0,
  keychain: 0,
  passphrase: 0,
  unlockedKeychain: 0,
  caret: 0,
};
var batchNum = {
  notes: 0,
  flashcards: 0,
};

const entry = () => {
  fetch("strings.js").then((response) => {
    if (response.status == 200) {
      response.text().then((strings) => {
        var stringElements = document.createElement("script");
        stringElements.innerHTML = strings;
        document.body.appendChild(stringElements);
      });
    }
  });
  fetch("screen-activity.html").then((response) => {
    if (response.status == 200) {
      response.text().then((app) => {
        var appElement = document.createElement("div");
        appElement.innerHTML = app;
        document.body.appendChild(appElement);
        showApp();
        loadNotes();
        var noteID = new URL(window.location).searchParams.get("noteId");
        var deckID = new URL(window.location).searchParams.get("deckId");
        if (noteID != null || noteID != undefined) {
          openNotes(noteID);
        }
        if (deckID != null || deckID != undefined) {
          openDeck(deckID);
        }


        var deckTypeElem = document.createElement("div");
        deckTypeElem.setAttribute("class", "write-new-note-screen current-screen");
        // document.body.style.overflowY = "hidden";
        deckTypeElem.innerHTML = `
            <div class="screen-background"></div>
          <div class="popup" style="overflow: auto;">
              <div style="margin: 20px">
                <h2 style="margin-top: 30px; text-align: center;">Welcome to Ceccun Notes!</h2>
                <p style="text-align: left;">Howdy friend and welcome to Ceccun Notes. Bear in mind, that this version of Notes is an early-access build meaning it contains bugs, glitches and probably isn't even finished. To make it easy for you to keep track, we'll just make a list of everything that works:</p>
                <ul>
                  <li>Note saving</li>
                  <li>Note encryption (works, but not finished)</li>
                  <li>Note deletion</li>
                  <li>Note Markdown preview (very unstable)</li>
                  <li>Deck previews</li>
                </ul>
                <p>We hope you have fun and enjoy using our product. (〃＾▽＾〃)</p>

                <button onclick="document.getElementsByClassName('current-screen')[0].remove()" style="border: solid 2px rgb(27, 46, 121); background-color: rgb(31, 76, 255); color: white; appearance: none; position: relative; left: 50%; transform: translateX(-50%); padding: 10px; border-radius: 5px;">Get Started</button>
              </div>
          </div>`;

        document.body.appendChild(deckTypeElem);

        document
          .getElementsByClassName("screen-background")[0]
          .addEventListener("click", () => {
            document.getElementsByClassName("current-screen")[document.getElementsByClassName("current-screen").length - 1].remove();
            // document.body.style.overflowY = "auto";
          });



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
  window.history.pushState("", "", "?");
};

const loadNotes = () => {
  downloadNotesList(batchNum["notes"]);
};

const downloadNotesList = (batchNumber) => {
  const ls = window.localStorage;
  const errorElem = `<div class="note-item-inner">
                  <img style="display: inline-block; vertical-align: middle; height: 20px; filter: var(--invert-icon)" src='/images/alerttri.svg'/>
                  <p style="display: inline-block; margin: 0 0 0 10px; vertical-align: middle;">This note is unavailable.</p>
                  </div>`;

  if (batchNum["notes"] != "fin") {
    fetch(`https://api.ceccun.com/api/v1/notes?batch=${batchNum["notes"]}`, {
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
                  try {
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
                  } catch (error) {
                    document.getElementById(
                      `notePreviewDiv_${notesListContents[item]}`
                    ).innerHTML = errorElem;
                    document
                      .getElementById(
                        `notePreviewDiv_${notesListContents[item]}`
                      )
                      .setAttribute("class", "note-item selectable");
                    document
                      .getElementById(
                        `notePreviewDiv_${notesListContents[item]}`
                      )
                      .setAttribute(
                        "onclick",
                        `openNotes("${notesListContents[item]}")`
                      );
                  }

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
                ).innerHTML = errorElem;
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
      } else {
        window.location.href = "/screens/login.html"
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
        This is your new note on Ceccun Notes.<br>
        Ceccun Notes is designed to be:<br>
        - Fast,<br>
        - easy<br>
        - and just awesome 😎.<br>

        ![alt](/images/promo/note-screenshot.png)<br>
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
  window.history.pushState("", "", `?noteId=${noteNumber}`);
  // if (importedScripts.includes("markdown.js") == false) {
  //   importedScripts.push("markdown.js");
  //   fetch("js/marked.js").then((response) => {
  //     if (response.status == 200) {
  //       response.text().then((data) => {
  //         var mdScript = document.createElement("script");
  //         mdScript.innerHTML = data;
  //         document.body.appendChild(mdScript);
  //       });
  //     }
  //   });
  // }

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
            <div class="note-typing md" style="display: none;">
                <skel />
            </div>
        </div>
        <div class="note-footer">
          <div class="note-footer-add-button">
                <img src="../images/new.svg" />
                <trn>
                    <div>
                        <p>Add</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-20px)" class="note-footer-button-context">
                  <p>Add New</p>
                  <div onclick="addTextElem('title')" class="button">Title</div>
                  <div class="button">Body</div>
                  <div class="button">Checkmark</div>
                  <div onclick="addTextElem('list')" class="button">List</div>
                </div>
            </div>

            <div class="note-footer-image-button">
                <img src="/images/image.svg" />
                <trn>
                    <div>
                        <p>Media</p>
                    </div>
                    <div></div>
                </trn>
            </div>

            <div class="note-footer-encrypt-button">
                <img onclick="encryptNote()" src="/images/unlocked_holo.svg" />
                <trn>
                    <div>
                        <p onclick="encryptNote()">Encryption</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-33px);" class="note-footer-button-context">
                  <p>This note is not encrypted.</p>
                  <div onclick="encryptNote()" class="button">Encrypt</div>
                </div>
            </div>

            <div class="note-footer-delete-button">
                <img onclick="deleteNote()" src="/images/delete.svg" />
                <trn>
                    <div>
                        <p onclick="deleteNote()">Remove</p>
                    </div>
                    <div></div>
                </trn>

                <div style="transform: translateX(-60px)" class="note-footer-button-context">
                  <p>Remove Note?</p>
                  <div onclick="deleteNote(2)" class="button">Remove</div>
                </div>
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
        document
          .getElementsByClassName("note-typing")[0]
          .addEventListener("mouseout", noteLoseFocus);
        document
          .getElementsByClassName("note-typing")[0]
          .addEventListener("mousedown", noteBackIn);
        document
          .getElementsByClassName("note-typing")[1]
          .addEventListener("mousedown", noteBackIn);
      });
    } else {
      document.getElementsByClassName("note-typing")[0].innerHTML = `
        <p style="text-align: center; margin-bottom: 10px;">This note is unavailable</p>
        <button style="position: relative; left: 50%; transform: translateX(-50%);" onclick="document.getElementsByClassName('current-screen')[0].remove(); window.history.pushState('','','?')">Close</button>
        <p style="text-align: center; margin-top: 10px;">Learn more: Why are notes unavailable?</p>
      `;
      document
        .getElementsByClassName("note-typing")[0]
        .setAttribute("contenteditable", "false");
    }
  });
};

const reassessInput = (e) => {
  currentNote["caret"] = getCaretPosition(
    document.getElementsByClassName("note-typing")[0]
  );
  var noteSteadiness =
    document.getElementsByClassName("note-typing")[0].innerHTML;
  setTimeout(() => {
    saveNote(noteSteadiness);
  }, 1500);
};

const noteLoseFocus = () => {
  console.log("lsot");
  var textSplit = document
    .getElementsByClassName("note-typing")[0]
    .innerText.split("\n");
  if (document.activeElement.className != "note-typing") {
    document.getElementsByClassName("note-typing")[1].setAttribute("style", "");
    document
      .getElementsByClassName("note-typing")[0]
      .setAttribute("style", "display: none");
  }

  for (item in textSplit) {
    if (item == 0) {
      document.getElementsByClassName("note-typing")[1].innerHTML = ``;
    }
    if (textSplit[item].trim() == "") {
      document.getElementsByClassName("note-typing")[1].innerHTML += `<br>`;
      console.log(textSplit[item]);
    }
    document.getElementsByClassName("note-typing")[1].innerHTML += marked(
      textSplit[item]
    );
  }
};

const noteBackIn = () => {
  document
    .getElementsByClassName("note-typing")[1]
    .setAttribute("style", "display: none");
  document.getElementsByClassName("note-typing")[0].setAttribute("style", "");
};

const saveNote = (noteSteadiness, action = "general") => {
  const ls = window.localStorage;
  try {
    if (
      noteSteadiness ==
      document.getElementsByClassName("note-typing")[0].innerHTML
    ) {
      if (currentNote["encrypted"] == 0) {
        currentNote["lastState"] = document
          .getElementsByClassName("note-typing")[0]
          .innerHTML.toString();
        currentNote["preview"] = document
          .getElementsByClassName("note-typing")[1]
          .innerText.substring(0, 256);
        lastState = currentNote["lastState"];
        ogState = currentNote["ogState"];
      } else {
        currentNote["lastState"] = encrypt(
          document.getElementsByClassName("note-typing")[0].innerHTML,
          currentNote["unlockedKeychain"]
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
  var lockedState = `
      <img src="/images/locked_holo.svg">
      <trn>
        <div>
          <p>Encryption</p>
        </div>
      </trn>


      <div style="transform: translateX(-33px);" class="note-footer-button-context">
        <p>This note is encryped.</p>
        <div onclick="encryptNote(7)" class="button">Change</div>
        <div onclick="encryptNote(6)" class="button">Disable</div>
      </div>
      `;
  if (currentNote["loaded"] == 1) {
    if (encryptNote == 0) {
      var newElem = document.createElement("div");
      newElem.innerHTML = `<div class="screen-background"></div>
        <div class="popup">
            <div>
            <h2>Encrypt Note?</h2>
            <p>Encrypt this note using a set passphrase.</p>
            <input class="encrypt-note-input" />
            <button onclick="encryptNote(5)">Cancel</button>
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
      document.getElementsByClassName(
        "note-footer-encrypt-button"
      )[0].innerHTML = lockedState;
    }

    if (encryptNote == 3) {
      var newElem = document.createElement("div");
      newElem.innerHTML = `<div class="screen-background"></div>
        <div class="popup">
            <div>
            <h2>Decrypt Note</h2>
            <p>Break this note's encryption by entering the passphrase.</p>
            <input class="encrypt-note-input" />
            <button onclick="encryptNote(5)">Cancel</button>
            <button onclick="encryptNote(4)">Break</button>
            </div>
        </div>`;
      newElem.setAttribute("class", "delete-note");
      document.body.appendChild(newElem);
      document.getElementsByClassName(
        "note-footer-encrypt-button"
      )[0].innerHTML = lockedState;
    }

    if (encryptNote == 4) {
      var passphrase =
        document.getElementsByClassName("encrypt-note-input")[0].value;

      try {
        currentNote["unlockedKeychain"] = decrypt(
          currentNote["keychain"],
          passphrase
        );
      } catch (error) {
        document.getElementsByClassName("delete-note")[0].remove();
        document.getElementsByClassName("write-new-note-screen")[0].remove();
      }
      document.getElementsByClassName("delete-note")[0].remove();
      console.log(currentNote["ogState"]);
      console.log(
        decrypt(currentNote["ogState"], currentNote["unlockedKeychain"])
      );
      try {
        document.getElementsByClassName("note-typing")[0].innerHTML = decrypt(
          currentNote["ogState"],
          currentNote["unlockedKeychain"]
        );
      } catch (error) {
        document.getElementsByClassName("delete-note")[0].remove();
        document.getElementsByClassName("write-new-note-screen")[0].remove();
      }
    }

    if (encryptNote == 5) {
      document.getElementsByClassName("delete-note")[0].remove();
      document.getElementsByClassName("write-new-note-screen")[0].remove();
    }
  }
};

const addTextElem = (type) => {
  if (currentNote["loaded"] == 1) {
    if (type == "title") {
      var titleElem = document.createElement("h1");
      titleElem.innerText = "Title";
      document.getElementsByClassName("note-typing")[0].appendChild(titleElem);
    }
    if (type == "list") {
      var listElem = document.createElement("ol");
      listElem.innerHTML = "<li></li>";
      document.getElementsByClassName("note-typing")[0].appendChild(listElem);
    }
  }
};

const getCaretPosition = (element) => {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
};

const swapSide = (side) => {
  batchNum = { notes: 0, flashcards: 0 };
  if (side == "fc") {
    var currentSection = "flashcards";
    document.getElementsByClassName(
      "ls-notes"
    )[0].innerHTML = `<div onclick="createDeck()" class='note-item selectable'>
            <div class='note-item-inner'>
                <div class="create-new-modal-container">
                    <p>Create New</p>
                    <img src="/images/new.svg" />
                </div>
            </div>
        </div>
        <div class="ls-notes-notes"></div>`;
    downloadDecksList();
  }
  if (side == "nc") {
    var currentSection = "notes";
    document.getElementsByClassName(
      "ls-notes"
    )[0].innerHTML = `<div onclick="createDeck()" class='note-item selectable'>
            <div class='note-item-inner'>
                <div class="create-new-modal-container">
                    <p>Create New</p>
                    <img src="/images/new.svg" />
                </div>
            </div>
        </div>
        <div class="ls-notes-notes"></div>`;
    loadNotes();
  }
  if (side == "ac") {
    var currentSection = "about";
    document.getElementsByClassName("ls-notes")[0].innerHTML = `
    <div style="border: 0; text-align: center;" class="note-item">
      <div class="note-item-inner">
        <h2>Ceccun Notes</h2>
        <p>Your cloud note-taking app.</p>
        <p flsestring="copyright"></p>
        <p>Installed By: ${packMan["stamp"]}</p>
      </div>
    </div>
    `;
  }
};

const downloadDecksList = (batchNumber) => {
  const ls = window.localStorage;
  const errorElem = `<div class="note-item-inner">
                  <img style="display: inline-block; vertical-align: middle; height: 20px; filter: var(--invert-icon)" src='/images/alerttri.svg'/>
                  <p style="display: inline-block; margin: 0 0 0 10px; vertical-align: middle;">This deck is unavailable.</p>
                  </div>`;

  if (batchNum["flashcards"] != "fin") {
    fetch(
      `https://api.ceccun.com/api/v1/flashcards?batch=${batchNum["flashcards"]}`,
      {
        headers: {
          authorization: ls.getItem("token"),
        },
      }
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((notesList) => {
          deckListContents = notesList["content"];
          if (deckListContents.length == 10) {
            batchNum["flashcards"] += 1;
            console.log(batchNum);
          } else {
            batchNum["flashcards"] = "fin";
            console.log(batchNum);
          }

          for (const item of deckListContents) {
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
              outerElem.setAttribute("id", `deckPreviewDiv_${item}`);
              outerElem.appendChild(inner);
              document
                .getElementsByClassName("ls-notes-notes")[0]
                .appendChild(outerElem);
            }
          }
          var count = 0;
          for (const item in deckListContents) {
            fetch(
              `https://api.ceccun.com/api/v1/flashcards/${deckListContents[item]}/details`,
              {
                headers: {
                  authorization: ls.getItem("token"),
                },
              }
            ).then((response) => {
              if (response.status == 200) {
                response.json().then((data) => {
                  try {
                    var noteContents = `${data["content"]["name"]} (${data["content"]["length"]})`;
                    if (noteContents.length >= 255) {
                      noteContents = noteContents.substring(0, 255) + "...";
                    }
                    var newPElem = document.createElement("p");
                    newPElem.setAttribute(
                      "id",
                      `deckPreview_${deckListContents[item]}`
                    );
                    newPElem.innerText = noteContents;

                    var innerElem = document.createElement("div");
                    innerElem.setAttribute("class", "note-item-inner");
                    innerElem.appendChild(newPElem);
                  } catch (error) {
                    document.getElementById(
                      `deckPreviewDiv_${deckListContents[item]}`
                    ).innerHTML = errorElem;
                    document
                      .getElementById(
                        `deckPreviewDiv_${deckListContents[item]}`
                      )
                      .setAttribute("class", "note-item selectable");
                    document
                      .getElementById(
                        `deckPreviewDiv_${deckListContents[item]}`
                      )
                      .setAttribute(
                        "onclick",
                        `openDeck("${deckListContents[item]}")`
                      );
                  }

                  try {
                    document.getElementById(
                      `deckPreviewDiv_${deckListContents[item]}`
                    ).innerHTML = "";
                    document
                      .getElementById(
                        `deckPreviewDiv_${deckListContents[item]}`
                      )
                      .appendChild(innerElem);
                    document
                      .getElementById(
                        `deckPreviewDiv_${deckListContents[item]}`
                      )
                      .setAttribute(
                        "onclick",
                        `openDeck("${deckListContents[item]}")`
                      );
                    document
                      .getElementById(
                        `deckPreviewDiv_${deckListContents[item]}`
                      )
                      .setAttribute("class", "note-item selectable");
                  } catch (error) {
                    document
                      .getElementsByClassName("ls-notes-notes")[0]
                      .appendChild(
                        createPreview(
                          deckListContents[item],
                          data["content"]["preview"]
                        )
                      );
                  }
                  count += 1;
                });
              } else {
                document.getElementById(
                  `deckPreviewDiv_${deckListContents[item]}`
                ).innerHTML = errorElem;
                document
                  .getElementById(`deckPreviewDiv_${deckListContents[item]}`)
                  .setAttribute("class", "note-item selectable");
                document
                  .getElementById(`deckPreviewDiv_${deckListContents[item]}`)
                  .setAttribute(
                    "onclick",
                    `openDeck("${deckListContents[item]}")`
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

const openDeck = (deckNumber) => {
  const ls = window.localStorage;
  window.history.pushState("", "", `?deckId=${deckNumber}`);

  var deckTypeElem = document.createElement("div");
  deckTypeElem.setAttribute("class", "write-new-note-screen current-screen");
  // document.body.style.overflowY = "hidden";
  deckTypeElem.innerHTML = `
       <div class="screen-background"></div>
    <div class="popup">
        <div class="new-note-header">
            <div onclick="document.getElementsByClassName('current-screen')[0].remove()">
                <img src="/images/chevron.svg" />
                <trn>
                    <div>
                        <p>Close Deck</p>
                    </div>
                    <div></div>
                </trn>
            </div>
        </div>
        <div class="deck-body" style="margin: 20px">

        <div class="main-ctn-skel">
          <div class='skel' style='width: 60%; height: 150px; margin-bottom: 40px; position: relative; left: 50%; transform: translateX(-50%)'></div>
          <div class='skel' style='width: 40%; height: 40px; margin-bottom: 30px;'></div>
          <div style="display: flex; justify-content: space-between; gap: 25px;">
            <div class='skel' style='width: 100%; height: 20px; margin-bottom: 30px;'></div>
            <div class='skel' style='width: 100%; height: 20px; margin-bottom: 30px;'></div>
            <div class='skel' style='width: 100%; height: 20px; margin-bottom: 30px;'></div>
          </div>
          <div class='skel' style='width: 40%; height: 20px; margin-bottom: 10px; margin-right: 5px; display: inline-block;'></div>
          <div class='skel' style='width: 20px; height: 20px; margin-bottom: 10px; display: inline-block; animation: none;'></div>

          <div class='skel' style='width: 100%; height: 15px;'></div>
          <div class='skel' style='width: 90%; height: 15px;'></div>
          <div class='skel' style='width: 85%; height: 15px;'></div>
          <div class='skel' style='width: 90%; height: 15px;'></div>
          <div class='skel' style='width: 98%; height: 15px;'></div>
          <div class='skel' style='width: 67%; height: 15px;'></div>
          <div class='skel' style='width: 23%; height: 15px;'></div>
        </div>

        </div>
    </div>`;

  document.body.appendChild(deckTypeElem);

  document
    .getElementsByClassName("screen-background")[0]
    .addEventListener("click", () => {
      document.getElementsByClassName("current-screen")[0].remove();
      // document.body.style.overflowY = "auto";
    });

  fetch(`https://api.ceccun.com/api/v1/flashcards/${deckNumber}/details`, {
    headers: {
      "authorization": ls.getItem("token")
    }
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        data = data.content;
        const hostDiv = document.createElement('div');
        hostDiv.className = "card-home"
        const card = document.createElement('div');
        card.className = "card-preview"
        var cardsub = "cards";
        if (data.length == 1) {
          cardsub = "card";
        }
        card.innerHTML = `<p>${data.length} <a flsestring="${cardsub}"></a></p>`;
        hostDiv.appendChild(card);

        var title = document.createElement("h2");
        title.innerText = data.name;

        hostDiv.appendChild(title);

        var centralbtns = document.createElement('div');
        centralbtns.className = "deck-central-btn";

        centralbtns.innerHTML = `
        <div flsestring="edit">Edit</div>
        <div flsestring="revise">Revise</div>
        <div flsestring="test">Test</div>
        `

        hostDiv.appendChild(centralbtns);

        document.getElementsByClassName("main-ctn-skel")[0].remove();
        document.getElementsByClassName("deck-body")[0].appendChild(hostDiv);
      })
    }
  });

  swapSide("fc");
};
