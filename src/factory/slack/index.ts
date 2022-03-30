import { WebClient } from "@slack/web-api"
import { App } from "@slack/bolt"
import type { ISlackAppParams } from "../../types/slackAppParams"
import type { ISlackAppInstance } from "../../types/slackAppInstance"

export function getSlackAppInstance (params: ISlackAppParams) : ISlackAppInstance {
    const api = new WebClient(params.botToken)
    const app = new App({
        token: params.botToken,
        signingSecret: params.signingSecret,
        socketMode: true,
        appToken: params.appToken
    })
    return {
        app,
        api
    }
}
