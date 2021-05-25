const timeHandler = new Date();
const hour = timeHandler.getHours().toString().padStart(2, '0');
const minute = timeHandler.getMinutes().toString().padStart(2, '0');
const second = timeHandler.getSeconds().toString().padStart(2, '0');

return `${hour}:${minute}.${second}`;