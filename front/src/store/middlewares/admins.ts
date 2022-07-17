import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {BadRequest, BaseRequest} from "../../types/apiTypes";
import {StatusExecutionRequest} from "../../types/typesSystem";

export const editSelfAdmin = createAsyncThunk(actionTypes.editSettingsAdmin, async (data: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api getProjects:\n
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
    const result = {
        status: StatusExecutionRequest.PENDING,
        detail: "",
        title: "",
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
        result.admin = apiResult.data
    }
    return result



})

export const getListAdmins = createAsyncThunk(actionTypes.getAdmins, async (data: BaseRequest
) => {
    if (config.global.isDebug) {
        console.log(`Api getListAdmins:\n
        Url: ${JSON.stringify(apiRouts.getAdmins)}\n`)
    }
    const response = await fetch(apiRouts.getAdmins.api,
        {
            method: apiRouts.getAdmins.method.toUpperCase(),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            }
        })
    const apiResult = await response.json()
    const result = {
        status: StatusExecutionRequest.SUCCESS,
        title: "",
        detail: "",
        admins: [],
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title
    } else {
        result.admins = apiResult.data.admins
    }
    return result
})


export const createAdmin = createAsyncThunk(actionTypes.createAdmin, async (data: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api createAdmins:\n
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
    const result = {
        status: StatusExecutionRequest.PENDING,
        detail: "",
        title: "",
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
        result.admin = apiResult.data
    }
    return result
})

export const deleteAdmin = createAsyncThunk(actionTypes.deleteAdmin, async (data: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api deleteAdmins:\n
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
    const result = {
        status: StatusExecutionRequest.PENDING,
        detail: "",
        title: "",
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
        result.admin = apiResult.data
    }
    return result
})
export const restoreAdmin = createAsyncThunk(actionTypes.restoreAdmin, async (data: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api deleteAdmins:\n
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
    const result = {
        status: StatusExecutionRequest.PENDING,
        detail: "",
        title: "",
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
        result.admin = apiResult.data
    }
    return result
})


