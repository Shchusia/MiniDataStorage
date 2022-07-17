import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {BadRequest, BaseRequest} from "../../types/apiTypes";
import {StatusExecutionRequest} from "../../types/typesSystem";
import {RequestBaseApi, ResponseBaseApi} from "./types";
import {deleteAdmin, restoreAdmin} from "../middlewares/admins";

export async function editSelfAdminFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api editSelfAdmin:\n
        Url: ${JSON.stringify(apiRouts.editSettingsAdmin)}\n
        Data: ${JSON.stringify(data)}`)
    }
    const response = await fetch(apiRouts.editSettingsAdmin.api,
        {
            method: apiRouts.editSettingsAdmin.method.toUpperCase(),
            body: JSON.stringify({...data.data}),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            }
        })
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {}
    }
    const apiResult = await response.json()

    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        result.responseData = apiResult.data
    }
    return result
}


export async function getListAdminsFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api getListAdmins:\n
        Url: ${JSON.stringify(apiRouts.getAdmins)}\n
        Data: ${JSON.stringify(data)}`)

    }
    const response = await fetch(apiRouts.getAdmins.api,
        {
            method: apiRouts.getAdmins.method.toUpperCase(),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            }
        })
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {}
    }
    const apiResult = await response.json()

    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        //@ts-ignore
        result.responseData.admins = apiResult.data.admins
    }
    return result
}

export async function createAdminFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api createAdmin:\n
        Url: ${JSON.stringify(apiRouts.createAdmin)}\n
        Data: ${JSON.stringify(data)}`)

    }
    const response = await fetch(apiRouts.createAdmin.api,
        {
            method: apiRouts.createAdmin.method.toUpperCase(),
            body: JSON.stringify({...data.data}),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            }
        })
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {}
    }
    const apiResult = await response.json()

    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        //@ts-ignore
        result.responseData.admin = apiResult.data
    }
    return result
}
export async function deleteAdminFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api deleteAdmin:\n
        Url: ${JSON.stringify(apiRouts.deleteAdmin)}\n
        Data: ${JSON.stringify(data)}`)

    }
    //@ts-ignore
    const response = await fetch(apiRouts.deleteAdmin.api + (data.optional.adminId as string ),
        {
            method: apiRouts.deleteAdmin.method.toUpperCase(),
            // body: JSON.stringify({...data.data}),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            }
        })
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {}
    }
    const apiResult = await response.json()

    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        //@ts-ignore
        result.responseData.admin = apiResult.data
    }
    return result
}
export async function restoreAdminFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api restoreAdmin:\n
        Url: ${JSON.stringify(apiRouts.restoreAdmin)}\n
        Data: ${JSON.stringify(data)}`)

    }
    //@ts-ignore
    const response = await fetch(apiRouts.restoreAdmin.api + (data.optional.adminId as string ),
        {
            method: apiRouts.restoreAdmin.method.toUpperCase(),
            // body: JSON.stringify({...data.data}),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            }
        })
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {}
    }
    const apiResult = await response.json()

    if (response.status !== 200) {

        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        //@ts-ignore
        result.responseData.admin = apiResult.data
    }
    return result
}





