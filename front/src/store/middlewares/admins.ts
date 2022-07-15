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
        console.log(`Api getProjects:\n
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