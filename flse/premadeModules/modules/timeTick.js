const random = Math.random.toString();
const timeHandler = new Date();
const hour = timeHandler.getHours().toString().padStart(2, '0');
const minute = timeHandler.getMinutes().toString().padStart(2, '0');
const second = timeHandler.getSeconds().toString().padStart(2, '0');

setInterval(() => {
    const timeHandler = new Date();
    const hour = timeHandler.getHours().toString().padStart(2, '0');
    const minute = timeHandler.getMinutes().toString().padStart(2, '0');
    const second = timeHandler.getSeconds().toString().padStart(2, '0');
    try { document.getElementById(random).innerHTML = `${hour}:${minute}.${second}`; } catch(error) {}
}, 100);

return `<div id="${random}">${hour}:${minute}.${second}</div>`;