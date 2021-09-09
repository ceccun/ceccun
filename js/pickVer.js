function pickVer(appURL) {
  var scr = document.createElement("script");
  scr.src = `${appURL}/js/a.js`;
  document.body.appendChild(scr);
}
