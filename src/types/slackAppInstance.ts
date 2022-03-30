import type { App } from "@slack/bolt";
import type { WebClient } from "@slack/web-api";

export interface ISlackAppInstance {
    app: App,
    api: WebClient
}