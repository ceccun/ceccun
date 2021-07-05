return `<div class="main-header">

</div>

<style>
@media only screen and (min-width: 769px) {
    .main-header {
        width: 100%;
        height: 50px;
        top:0;
        left:0;
        position: fixed;
        background-color: var(--body-color);
        display: flex;
        z-index: 100;
        border-bottom: solid 2px var(--app-color-borders);
    }
}
@media only screen and (max-width: 768px) {
    .main-header {
        display: none;
    }
}
</style>`