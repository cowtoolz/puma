<script lang="ts">
    let { is_user = false, body = "", thinking = false } = $props();
</script>

<div class="message {is_user ? 'user' : 'assistant'}">
    <div class="bubble">
        {#if !thinking}
            {body}
        {:else}
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        {/if}
    </div>
</div>

<style>
    .message {
        display: flex;
        margin-bottom: 8px;
    }

    .message.user {
        justify-content: flex-end;
    }

    .message.assistant {
        justify-content: flex-start;
    }

    .bubble {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 18px;
        font-size: 16px;
        line-height: 1.4;
        word-wrap: break-word;
    }

    .user .bubble {
        background: black;
        color: white;
        border-bottom-right-radius: 4px;
        border: 2px solid white;
    }

    .assistant .bubble {
        background: white;
        color: black;
        border-bottom-left-radius: 4px;
        border: 2px solid black;
    }

    .typing-indicator {
        span {
            height: 15px;
            width: 15px;
            float: left;
            margin: 0 1px;
            background-color: #000;
            display: block;
            border-radius: 50%;
            opacity: 1;
        }
    }
</style>
