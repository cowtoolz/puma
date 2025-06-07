<script lang="ts">
    import { errors } from "$lib/stores/errors";
    import { history } from "$lib/stores/history";
    import { send_msg, unwrap_message } from "$lib/anthropic/chat";

    import Dropzone from "./Dropzone.svelte";
    import Message from "./Message.svelte";
    import ErrorToast from "./ErrorToast.svelte";

    let dropzone_hidden = $state(false);
    let image_blob = $state("");
    let chatbox_content = $state("");
    let show_thinking = $state(false);

    async function sendMessage() {
        if (chatbox_content.length === 0) {
            return;
        }
        show_thinking = true;
        let message_content = chatbox_content;
        chatbox_content = "";
        await send_msg(message_content);
        show_thinking = false;
    }
</script>

{#each $errors as err}
    <ErrorToast body={err} />
{/each}

{#if !dropzone_hidden}
    <Dropzone bind:hidden={dropzone_hidden} bind:blob={image_blob} />
{:else}
    <img id="background" src={image_blob} alt="background" />

    <section class="container">
        {#each $history as message}
            {#if unwrap_message(message) !== ""}
                <Message
                    is_user={message.role === "user" ? true : false}
                    body={unwrap_message(message)}
                />
            {/if}
        {/each}

        {#if show_thinking || $history.length < 2}
            <Message thinking={true} />
        {/if}
    </section>

    <div class="container" id="chatbox">
        <form
            onsubmit={(e) => {
                e.preventDefault();
                sendMessage();
            }}
        >
            <input bind:value={chatbox_content} />
            <button type="submit">Send</button>
        </form>
    </div>
{/if}

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -2;

        filter: blur(33vw);
    }

    #background::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(20px);
        z-index: -1;
    }

    .container {
        max-width: 75%;
        margin: 0 auto;
        padding: 0 16px;
    }

    section.container {
        height: calc(100vh - 80px);
        overflow-y: auto;
        padding-top: 20px;
        padding-bottom: 0px;
        margin-bottom: 20vh;
        display: flex;
        flex-direction: column;
        gap: 8px;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    section.container::-webkit-scrollbar {
        display: none;
    }

    section.container::-webkit-scrollbar {
        display: none;
    }

    #chatbox {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 600px;
        padding: 12px 16px;
    }

    #chatbox form {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-direction: column;
    }

    #chatbox input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #000;
        border-radius: 20px;
        font-size: 16px;
        outline: none;
        background: #ffffffff;
        backdrop-filter: blur(20px);
    }

    #chatbox button {
        padding: 12px 20px;
        background: #000;
        color: white;
        border: 2px solid black;
        border-radius: 20px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
    }

    #chatbox button:hover {
        color: black;
        background: #ffffff;
    }
</style>
