const randomID = "btn_" + Math.random().toString(27).substring(7);

return `<div style="${element.getAttribute("style")}" id="${element.getAttribute("id")}" onClick="${element.getAttribute("onclick")}" class="${randomID}">
    ${element.innerHTML}

    <style>
        .${randomID} {
            background-color: var(--button-color);
            text-align: center;
            padding: 15px 0px 15px 0px;
            margin: 20px 0px 20px 0;
            width: 100%;
            border-radius: var(--button-radius);
            border: var(--app-color-borders) 2px solid;
            transition: background-color 0.1s ease;
            cursor: pointer;
        }

        .${randomID}:hover {
            background-color: var(--button-color-hov);
        }

        .${randomID} > p {
            color: var(--button-text-color);
            margin: 0;
            user-select: none;
        }
    </style>
</div>`;