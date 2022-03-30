import type { IPDDetailsForSlackApp } from "./pdDetailsForSlackApp";
import type { ISlackAppParams } from "./slackAppParams";

export type IAppName = string
export interface IParsedAppDetails {
    [key: IAppName]: {
        appName: IAppName,
        slackAppDetails: ISlackAppParams,
        pdDetails: IPDDetailsForSlackApp
    }
}