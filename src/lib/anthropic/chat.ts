import { PUMA_SYSTEM_PROMPT } from "$lib/anthropic/system_prompt";
import { errors } from "$lib/stores/errors";
import { history } from "$lib/stores/history";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources";

let anthropic: Anthropic;

let stateless_messages: MessageParam[] = [];

export async function initialize_conversation(
  apikey: string,
  msg: MessageParam,
) {
  anthropic = new Anthropic({
    apiKey: apikey,
    dangerouslyAllowBrowser: true,
  });
  stateless_messages.push(msg);
  progress_conversation();
}

async function progress_conversation() {
  try {
    let response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      temperature: 1,
      system: PUMA_SYSTEM_PROMPT,
      messages: stateless_messages,
    });

    stateless_messages.push({
      role: response.role,
      content: response.content,
    });
    history.update(() => stateless_messages);
  } catch (err: any) {
    errors.update((errs) => [`${err}`, ...errs]);
  }
}

export async function send_msg(user_msg: string) {
  stateless_messages.push({
    content: user_msg,
    role: "user",
  });
  history.update(() => stateless_messages);
  await progress_conversation();
}

export function unwrap_message(msg: MessageParam): string {
  if (typeof msg.content === "string") {
    return msg.content;
  }

  return msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
}
