import { api } from "@pagerduty/pdjs"
import type { PartialCall } from "@pagerduty/pdjs/build/src/api"
import type { IPDApiInstanceParams } from "../../types/pdAppParams"

const pd = api({ token: process.env.PD_TOKEN })

export function getPDApiInstance(params: IPDApiInstanceParams): PartialCall {
    if (!params.token) {
        throw Error("Pagerduty token not provided. Failed to instantiate PD Api instance.")
    }
    return api({
        token: params.token
    })
}