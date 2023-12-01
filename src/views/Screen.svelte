<script>
    import { afterUpdate, onDestroy, onMount } from "svelte";

    /** @type{import('svelte/store').Writable} */
    export let options;

    /** @type{HTMLImageElement} */
    let screen;

    let deviceUrl;

    onMount(async () => {
        options.subscribe((value) => {
            console.log("options.subscribe", value);
            deviceUrl = value.url;
        });

        fetch("/api/command", {
            method: "POST",
            body: "2345678",
        });

        // setInterval(async () => {
        //     let text = (
        //         await (
        //             await fetch(deviceUrl, {
        //                 method: "POST",
        //                 body: "takescreenshot scale 0.02",
        //             })
        //         ).json()
        //     ).data;

        //     screen.src = `data:image/png;base64,${text}`;
        // }, 1000);
    });
</script>

<div class="root">
    <img bind:this={screen} alt="" />
</div>

<style>
    .root {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
    img {
        max-width: 100%;
        max-height: 100%;
        min-width: 80%;
    }
</style>
