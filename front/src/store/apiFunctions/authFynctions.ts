import {RequestBaseApi, ResponseBaseApi} from "./types";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {StatusExecutionRequest} from "../../types/typesSystem";
import {BadRequest} from "../../types/apiTypes";


export async function refreshFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api refresh:\nUrl: ${apiRouts.refresh}`,)
    }
    const response = await fetch(apiRouts.refresh.api,
        {
            method: apiRouts.refresh.method.toUpperCase(),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
        result.responseData = {
            isAuth: false
        }
    } else {
        result.responseData = {
            isAuth: true
        }
        result.authData = {
            accessToken: response.headers.get('AT') as string,
            refreshToken: response.headers.get('RT') as string
        }
    }
    return result
}

export async function loginFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api login:\n
        Url: ${JSON.stringify(apiRouts.login)}}\n
        Data: ${JSON.stringify(data)}`,)
    }
    const response = await fetch(apiRouts.login.api,
        {
            method: apiRouts.login.method.toUpperCase(),
            body: JSON.stringify(data.data),
            headers: {

                "Content-type": "application/json"

            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
        result.responseData = {
            isAuth: false
        }
    } else {
        result.responseData = {
            isAuth: true
        }
        result.authData = {
            accessToken: response.headers.get('AT') as string,
            refreshToken: response.headers.get('RT') as string
        }
    }
    return result
}

export async function logoutFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api logout:\n
        Url: ${JSON.stringify(apiRouts.logout)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    const response = await fetch(apiRouts.logout.api,
        {
            method: apiRouts.logout.method.toUpperCase(),
            headers: {
                ...data.headers,
                "Content-type": "application/json"
            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }

    }
    result.responseData = {
        isAuth: false
    }
    result.authData = {
        accessToken: null,
        refreshToken: null
    }
    return result
}