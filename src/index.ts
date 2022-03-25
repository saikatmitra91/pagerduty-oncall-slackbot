import { App } from "@slack/bolt"
import dotenv from "dotenv"
import { api } from "@pagerduty/pdjs"
import qs from "query-string"
import { WebClient } from "@slack/web-api"
import { User } from "@slack/web-api/dist/response/UsersLookupByEmailResponse"
import { Message } from "@slack/web-api/dist/response/ChannelsHistoryResponse"
dotenv.config()

const slackApi = new WebClient(process.env.SLACK_BOT_TOKEN);

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode:true,
    appToken: process.env.SLACK_APP_TOKEN
});

const pd = api({ token: process.env.PD_TOKEN })
app.start(process.env.PORT || 3000);
app.message(async ({ say, message, client }) => {
    const queries = qs.stringify({
        since: (new Date()).toUTCString(), 
        until: (new Date()).toUTCString()
    })
    const path = `/schedules/${process.env.PD_SCHEDULE_ID}?${queries}`
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
                    thread_ts: (message as Message).thread_ts
                })
            }
        }
    }
})




