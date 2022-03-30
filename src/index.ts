import dotenv from "dotenv"
import qs from "query-string"
import type { User } from "@slack/web-api/dist/response/UsersLookupByEmailResponse"
import { Message } from "@slack/web-api/dist/response/ChannelsHistoryResponse"
import { getPDApiInstance } from "./factory/pd"
import { parseAppTokens } from "./parser/env"
import { getSlackAppInstance } from "./factory/slack"
dotenv.config()

const pd = getPDApiInstance({
    token: process.env.PD_TOKEN || ""
})

const appObj = parseAppTokens()

Object.values(appObj).forEach(app => {
    const { app: slackApp, api: slackApi } = getSlackAppInstance(app.slackAppDetails)
    slackApp.start()
    slackApp.event("app_mention", async ({ say, event }) => {
        const queries = qs.stringify({
            since: (new Date()).toUTCString(), 
            until: (new Date()).toUTCString()
        })
        const path = `/schedules/${app.pdDetails.scheduleId}?${queries}`
        const { data = {} } = await pd.get(path)
        const { schedule } = data 
        if (schedule) {
            const { final_schedule } = schedule
            const { rendered_schedule_entries = [] } = final_schedule
            const [ entry ] = rendered_schedule_entries
            if (!entry) {
                say("No user found for the schedule")
            } else {
                const { user } = entry
                const { id } = user
                if (id) {
                    const { data } = await pd.get(`/users/${id}`)
                    const { user } = data
                    const { email } = user
                    const resp = await slackApi.users.lookupByEmail({
                        email
                    })
                    const { user: slackUser } = resp
                    const { id: slackUserId } = slackUser as User
                    say({
                        text: `<@${slackUserId}> :point_up:`,
                        thread_ts: event.thread_ts
                    })
                }
            }
        }
    })
})




