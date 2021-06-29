const randomID = "btn_" + Math.random().toString(27).substring(7);

return `<div style="${element.getAttribute("style")}" id="${element.getAttribute("id")}" onClick="${element.getAttribute("onclick")}" class="${randomID} ${element.getAttribute("class")}">
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
            cursor: pointer;
            -webkit-tap-highlight-color:  rgba(255, 255, 255, 0) !important;
        }

        .${randomID} > p {
            color: var(--button-text-color);
            margin: 0;
            user-select: none;
        }

        @media only screen and (min-width: 769px) {

            .${randomID} {
                transition: background-color 0.1s ease;
            }
            .${randomID}:hover {
                background-color: var(--button-color-hov);
            }
        }

        @media only screen and (max-width: 768px) {
            .${randomID} {
            background-color: var(--button-color);
            transform: scale(1);
            -webkit-tap-highlight-color:  rgba(255, 255, 255, 0) !important;
            transition: transform 0.1s ease;
            }
            .${randomID}:active {
                transform: scale(0.95);
            }
        }
    </style>
</div>`;