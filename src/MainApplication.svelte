<script>
    import SplitView from "./views/SplitView.svelte";
    import Screen from "./views/Screen.svelte";
    import Options from "./views/Options.svelte";

    import { onMount } from "svelte";
    import { writable } from 'svelte/store';

    const options = writable({
        url: 'http://192.168.40.86:5678'
    })

    onMount(async () => {
        console.log(`onMount : `);
    });
</script>

<div class="container">
    <SplitView guid="4ec085e593ee40ae9090dd3d60a6f9b4" direction="horizontal">
        <SplitView
            slot="one"
            guid="ae8b86cbb2506096b51f1617775370b1"
            direction="vertical"
        >
            <Screen slot="one" {options} />
            <Options slot="two" />
        </SplitView>
        <SplitView
            slot="two"
            guid="fd8d4599ad34944fc6e44c3020040651"
            direction="vertical"
        >
            <SplitView
                slot="one"
                guid="c1b6dcae1202ca9f1c728ab6fff4db87"
                direction="horizontal"
            />
            <SplitView
                slot="two"
                guid="6a802822a273f423dc519d864de1bf17"
                direction="horizontal"
            />
        </SplitView>
    </SplitView>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: rgb(255, 255, 255);
    }
</style>
