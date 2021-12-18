if (created == 1) {
  var ls = document.createElement("div");
  ls.className = "lBar passwdStyledLBar";

  var styles = document.createElement("style");

  document.body.append(styles)

  ls.id = "passwdLBar";
  ls.innerHTML = `
    <div class="passwordlbar">
      <p flsestring="Hostname"></p>
      <input />
      <p flsestring="Username"></p>
      <input />

      <button>idk</button>
    </div>
  `;

  workspace.append(ls)
}
