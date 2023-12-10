<script>
    import { afterUpdate, onDestroy, onMount } from "svelte";

    /** @type{'horizontal' | 'vertical'} */
    export let direction = "horizontal";

    export let guid = "split-default";

    export let initSize = [50, 50];

    /** @type{HTMLDivElement} */
    let elementOne = null;
    /** @type{HTMLDivElement} */
    let elementGutter = null;
    /** @type{HTMLDivElement} */
    let elementTwo = null;

    let oldSplit = null;

    onDestroy(() => {
        if (oldSplit) {
            oldSplit.destroy(true, true);
        }
    });

    /**
     * @param {KeyboardEvent} e
     */
    async function onKeyPress(e) {
        console.log(e);
        let cmd = null;
        switch (e.key) {
            case "ArrowDown":
                cmd = "down";
                break;
            case "ArrowRight":
                cmd = "right";
                break;
            case "ArrowUp":
                cmd = "up";
                break;
            case "ArrowLeft":
                cmd = "left";
                break;
            case " ":
                cmd = "center";
                break;
            case "Backspace":
                cmd = "back";
                break;
            case "Home":
                cmd = "home";
                break;
            default:
                break;
        }
        if (cmd) {
            await fetch("/api/command", {
                method: "POST",
                body: JSON.stringify({
                    type: "press",
                    cmd: cmd,
                }),
            });
        }
    }
</script>

<div class="root">
    <p role="presentation" on:keydown={onKeyPress} tabindex="-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore sed
        maiores possimus nemo eaque odit veniam omnis optio, aliquam et quidem
        exercitationem rem nesciunt, modi dicta similique ut nostrum vel.
    </p>
</div>

<style>
    .root {
        display: flex;
        height: 100%;
        width: 100%;
    }
    .root.horizontal {
        flex-direction: row;
    }
    .root.vertical {
        flex-direction: column;
    }
    .one.horizontal {
        height: 100%;
    }
    .one.vertical {
        width: 100%;
    }
    .gutter {
        background-color: rgba(0, 26, 255, 0.527);
    }
    .gutter.horizontal {
        height: 100%;
    }
    .gutter.horizontal:hover {
        cursor: col-resize;
    }
    .gutter.vertical {
        width: 100%;
    }
    .gutter.vertical:hover {
        cursor: row-resize;
    }
    .two.horizontal {
        height: 100%;
    }
    .two.vertical {
        width: 100%;
    }
</style>
