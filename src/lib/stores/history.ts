import { writable } from "svelte/store";
import type { MessageParam } from "@anthropic-ai/sdk/resources";

export const history = writable<MessageParam[]>([]);
