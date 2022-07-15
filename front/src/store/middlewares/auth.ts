import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {BadRequest, BaseRequest} from "../../types/apiTypes";
import {StatusExecutionRequest} from "../../types/typesSystem";


export const login = createAsyncThunk(actionTypes.login, async (requestData: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api login:\nUrl: ${JSON.stringify(apiRouts.login)}}`,)
    }
    const response = await fetch(apiRouts.login.api,
        {
            method: apiRouts.login.method.toUpperCase(),
            // body: JSON.stringify(requestData.data),
            body: JSON.stringify(requestData.data),
            headers: {
                "Content-type": "application/json"
            }
        }
    )
    const result = {
        status: StatusExecutionRequest.PENDING,
        isAuth: false,
        detail: "",
        title: "",
        at: "",
        rt: "",
        admin: {}
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title
    } else {
        const apiResult = await response.json()

        result.status = StatusExecutionRequest.SUCCESS
        result.at = response.headers.get('AT') as string
        result.at = response.headers.get('at') as string
        // result.rt = response.headers.get('RT') as string
        result.rt = response.headers.get('rt') as string
        result.isAuth = true
        result.admin = apiResult.data
    }
    return result

})

export const refresh = createAsyncThunk(actionTypes.refresh, async (
    data: BaseRequest
) => {
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
    const result = {
        status: StatusExecutionRequest.SUCCESS,
        isAuth: false,
        detail: "",
        title: "",
        at: "",
        rt: ""
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title

    } else {
        result.isAuth = true
        result.at = response.headers.get('AT') as string
        result.rt = response.headers.get('RT') as string
    }
    return result

})

export const logout = createAsyncThunk(actionTypes.logout, async (
    data: BaseRequest
) => {
    if (config.global.isDebug) {
        console.log(`Api logout:\nUrl: ${apiRouts.logout}`,)
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
    const result = {
        status: StatusExecutionRequest.PENDING,
        isAuth: false,
        detail: "",
        title: ""
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title
    } else {
        result.status = StatusExecutionRequest.SUCCESS
        result.isAuth = false
    }
    return result

})