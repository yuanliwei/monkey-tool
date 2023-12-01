<script>
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import Split from "split.js";
    import { getCfg, putCfg } from "../common/PageStateStore.js";

    /** @type{'horizontal' | 'vertical'} */
    export let direction = "horizontal";
    let oldDirection = "";

    export let guid = "split-default";
    export let initSize = [50, 50];

    /** @type{HTMLDivElement} */
    let elementOne = null;
    /** @type{HTMLDivElement} */
    let elementGutter = null;
    /** @type{HTMLDivElement} */
    let elementTwo = null;

    let oldSplit = null;

    afterUpdate(async () => {
        if (oldDirection == direction) {
            return;
        }
        oldDirection = direction;
        if (oldSplit) {
            oldSplit.destroy(true, true);
        }
        elementOne.attributeStyleMap.clear()
        elementTwo.attributeStyleMap.clear()
        elementGutter.attributeStyleMap.clear()
        oldSplit = Split([elementOne, elementTwo], {
            sizes: await getCfg(guid) || initSize,
            minSize: [0, 0],
            direction: direction,
            gutter: (_index, _direction) => {
                return elementGutter;
            },
            onDragEnd: (sizes) => {
                putCfg(guid, sizes);
            },
        });
    });
    onDestroy(() => {
        if (oldSplit) {
            oldSplit.destroy(true, true);
        }
    });
</script>

<div class="root {direction}">
    <div class="one {direction}" bind:this={elementOne}>
        <slot name="one" />
    </div>
    <div class="gutter {direction}" bind:this={elementGutter} />
    <div class="two {direction}" bind:this={elementTwo}>
        <slot name="two" />
    </div>
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
        width: 100%;
        height: 100%;
    }
    .one.vertical {
        width: 100%;
        height: 100%;
    }
    .gutter {
        background-color: rgba(0, 26, 255, 0.527);
        touch-action: none;
        z-index: 10;
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
