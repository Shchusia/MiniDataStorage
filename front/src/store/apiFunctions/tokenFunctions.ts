import {RequestBaseApi, ResponseBaseApi} from "./types";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {StatusExecutionRequest} from "../../types/typesSystem";


export async function createTokenFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api createToken:\n
        Url: ${JSON.stringify(apiRouts.createToken)}}\n 
        Data: ${JSON.stringify(data)}`,)
    }
    const response = await fetch(apiRouts.createToken.api,
        {
            method: apiRouts.createToken.method.toUpperCase(),
            body: JSON.stringify(data.data),
            headers: {
                ...data.headers,
                'Content-Type': 'application/json'
            }
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {
            //@ts-ignore
            projectId: data?.data?.projectId,

        }
    }
    const apiResult = await response.json()
    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        result.responseData = {
            ...result.responseData,
            token: apiResult.data
        }
    }
    return result
}

export async function deleteTokenFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api deleteToken:\n
        Url: ${JSON.stringify(apiRouts.deleteToken)}}\n 
        Data: ${JSON.stringify(data)}`,)
    }
    //@ts-ignore

    const response = await fetch(apiRouts.deleteToken.api + (data.optional.tokenId as string),
        {
            method: apiRouts.deleteToken.method.toUpperCase(),
            headers: {
                ...data.headers,
                'Content-Type': 'application/json'
            }
        }
    )

    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {
            //@ts-ignore
            projectId: data?.optional?.projectId,
            //@ts-ignore
            token_id: data.optional.tokenId,
        }
    }
    const apiResult = await response.json()
    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    }
    return result
}