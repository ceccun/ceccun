var batch = 0;
var createdNoteScreen = false;

if (created == 1) {
  var ls = document.createElement("div");
  ls.className = "lBar";
  ls.id = "notesLBar";
  ls.innerHTML = `
  <h2>Notes</h2>
  <div id="notes-load-section">
  
  </div>
  `;
  
  workspace.appendChild(ls);
  
  document.getElementsByClassName("workspace")[0].appendChild(workspace);
  
  loadNotes();
}

function loadNotes() {
  var ls = window.localStorage;

  fetch("https://api.ceccun.com/api/v1/notes?batch=0", {
    headers: {
      authorization: ls.getItem("token")
    }
  }).then((response) => {
    if (response.status == 200) {
      response.json().then((data) => {
        const target = document.getElementById("notes-load-section");

        data.content.forEach((item, index) => {
          var containerItem = document.createElement("div");
          containerItem.className = "notesListItem noteListGhost";
          containerItem.id = `NOTES${item}-nor`;
          
          containerItem.addEventListener("click", (e) => {
            openNote(item);
          })

          var ghostItem = document.createElement("div");
          ghostItem.className = "skel"
          ghostItem.setAttribute("style", `width: calc(50% + ${Math.floor(Math.random()*150)}px)`)

          var preview = document.createElement("p");
          preview.id = `NOTES${item}-prev`;

          containerItem.appendChild(ghostItem);
          containerItem.appendChild(preview);

          target.appendChild(containerItem);

          fetch(`https://api.ceccun.com/api/v1/notes/${item}`, {
            headers: {
              authorization: ls.getItem("token")
            }
          }).then((response) => {
            document.getElementById(`NOTES${item}-nor`).className = "notesListItem"
            if (response.status == 200) {
              response.json().then((noteData) => {
                var newPreview = noteData.content.preview;
                if (newPreview.length > 250) {
                  newPreview = newPreview.splice(0,250)
                }
                if (newPreview.trim() == "") {
                  newPreview = "Empty Note"
                }
                document.getElementById(`NOTES${item}-prev`).innerText = newPreview;
              })
            } else {
              document.getElementById(`NOTES${item}-prev`).innerHTML = `<i>This note is unavailable.</i>`
            }
          })
        })
      });
    }
  });
}


function openNote(noteId) {
  if (createdNoteScreen == false) {
    var noteScreen = document.createElement("div");
  }
}