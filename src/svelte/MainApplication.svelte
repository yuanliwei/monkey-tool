<script>
    import "@material/mwc-checkbox";
    import "@material/mwc-drawer";
    import "@material/mwc-formfield";
    import "@material/mwc-icon-button";
    import "@material/mwc-icon";
    import "@material/mwc-textarea";
    import "@material/mwc-textfield";
    import "@material/mwc-top-app-bar";
    import "@material/mwc-radio";
    import "@material/mwc-button";
    import "@material/mwc-select";
    import "@material/mwc-list";
    import "@material/mwc-list/mwc-list-item";
    import "@material/mwc-list/mwc-check-list-item";

    import { onMount } from "svelte";

    onMount(async () => {
        console.log(`onMount : `);
    });
</script>

<div class="container">
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis sed
        asperiores accusamus sunt commodi nesciunt nobis quod mollitia minus?
        Laboriosam dolor accusantium illo! Quidem consequatur, facilis
        perspiciatis rerum molestiae qui?
    </p>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: rgb(248, 198, 198);
    }
</style>
