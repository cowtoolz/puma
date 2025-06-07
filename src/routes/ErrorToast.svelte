<script lang="ts">
    let { body } = $props();
</script>

<section>
    <strong>Error!</strong>
    <p>{body}</p>
</section>

<style>
    section {
        position: absolute;
        left: 2rem;
        top: 2rem;
        border: 1px solid black;
        border-radius: 20px;
        padding: 1rem;
        display: grid;
        grid-template-rows: auto 1fr;
        background-color: #f10000;
        backdrop-filter: blur(20px);
        text-wrap-style: pretty;
        max-width: 25vw;
        overflow-wrap: break-word;
        box-sizing: border-box;
        > * {
            color: white;
            min-width: 0;
        }
    }
</style>
