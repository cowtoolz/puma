<script lang="ts">
    import { initialize_conversation } from "$lib/anthropic/chat";

    let { hidden = $bindable(), blob = $bindable() } = $props();

    let dragover = $state(false);
    let file_input = $state<HTMLInputElement>();
    let api_key = $state("");

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        dragover = true;
    }

    function handleDragLeave(event: DragEvent) {
        event.preventDefault();
        dragover = false;
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        dragover = false;

        const droppedFiles = event.dataTransfer?.files;
        if (droppedFiles && droppedFiles.length > 0) {
            const file = droppedFiles[0];
            if (file.type.startsWith("image/")) {
                processImage(file);
            }
        }
    }

    function handleFileInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            if (file.type.startsWith("image/")) {
                processImage(file);
            }
        }
    }

    function processImage(file: File) {
        blob = URL.createObjectURL(file);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target?.result as string;
            // this should always be the first message, so we can just overwrite the history completely
            await initialize_conversation(api_key, {
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: file.type as
                                | "image/jpeg"
                                | "image/png"
                                | "image/gif"
                                | "image/webp",
                            data: imageData.split(",")[1],
                        },
                    },
                ],
            });
            hidden = true;
        };
        reader.readAsDataURL(file);
    }
</script>

<button
    class="dropzone"
    class:dragover
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={() => file_input?.click()}
>
    <div class="dropzone-content">
        <div class="header">
            <h1>𓃮</h1>
            <h2>puma</h2>
            <p>Drop an image here or click to select to begin chatting</p>
        </div>
        <input
            type="password"
            placeholder="Enter your Anthropic API key"
            bind:value={api_key}
            class="api-input"
            onclick={(e) => e.stopPropagation()}
        />
        <input
            type="file"
            accept="image/*"
            onchange={handleFileInput}
            style="display: none;"
            bind:this={file_input}
        />
    </div>
</button>

<style>
    .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        > h1 {
            font-size: 4rem;
            font-weight: bold;
        }
        > h1,
        h2 {
            color: white;
        }
    }

    .dropzone {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: black;
        padding: 40px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 0;
        color: white;
    }

    .dropzone.dragover {
        background-color: #fff;
        color: black;
    }

    .dropzone-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .dropzone p {
        margin: 0;
        color: #666;
        font-size: 16px;
    }
</style>
