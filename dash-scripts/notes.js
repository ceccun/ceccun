var workspaceName = "notes-workspace";

var workspace = document.getElementsByClassName(workspaceName)[0];

if (workspace == null) {
  workspace = document.createElement("div");
  workspace.className = `${workspaceName} workspace-active`;

  var ls = document.createElement("div");
  ls.className = "lBar";
  ls.id = "notesLBar";
  ls.innerHTML = `
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <p>Notes app lol</p>
    <h2>End brah</h2>
  `;

  workspace.appendChild(ls);

  document.getElementsByClassName("workspace")[0].appendChild(workspace);
}

document.getElementsByClassName("workspace-active")[0].className = document
  .getElementsByClassName("workspace-active")[0]
  .className.replace("workspace-active", "");

document.getElementsByClassName(
  workspaceName
)[0].className = `${workspaceName} workspace-active`;
