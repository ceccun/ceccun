const random = Math.random().toString();
const targetVar = element.getAttribute("target");

setInterval(() => {
    try { document.getElementById(random).innerText = window[targetVar]; } catch (error) { }
});

return `<div id="${random}"> </div>`;