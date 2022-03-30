import type { IAppName, IParsedAppDetails } from "../../types/parsedAppDetails"
import type { IPDDetailsForSlackApp } from "../../types/pdDetailsForSlackApp"
import type { ISlackAppParams } from "../../types/slackAppParams"

export function parseAppTokens(): IParsedAppDetails {
    const slackAppsStr = process.env.SLACK_BOTS || "" as IAppName
    const slackAppNames: IAppName[] = slackAppsStr.split(",")
    const slackAppsObj = slackAppNames.reduce((acc, appName) => {
        const slackAppDetails: ISlackAppParams = {
            botToken: process.env[`${appName}_SLACK_BOT_TOKEN`] || "",
            appToken: process.env[`${appName}_SLACK_APP_TOKEN`] || "",
            signingSecret: process.env[`${appName}_SLACK_SIGNING_SECRET`] || "",
            socketMode: true // keeping it true for now. 
        }
        const pdDetails: IPDDetailsForSlackApp = {
            scheduleId: process.env[`${appName}_PD_SCHEDULE_ID`] || "",
        }
        acc[appName] = {
            appName: appName,
            slackAppDetails,
            pdDetails
        }
        return acc
    }, {} as IParsedAppDetails)
    return slackAppsObj
}
