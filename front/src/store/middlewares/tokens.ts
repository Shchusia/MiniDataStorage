import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {BadRequest, BaseRequest} from "../../types/apiTypes";
import {StatusExecutionRequest} from "../../types/typesSystem";

export const createToken = createAsyncThunk(actionTypes.createToken, async (requestData: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api createToken:\n
        Url: ${JSON.stringify(apiRouts.createToken)}}\n 
        Data: ${JSON.stringify(requestData)}`,)
    }
    const response = await fetch(apiRouts.createToken.api,
        {
            method: apiRouts.createToken.method.toUpperCase(),
            body: JSON.stringify(requestData.data),
            headers: {
                ...requestData.headers,
                'Content-Type': 'application/json'
            }
        }
    )
    const result = {
        status: StatusExecutionRequest.SUCCESS,
        detail: "",
        title: "",
        token: {},
        //@ts-ignore
        projectId: requestData.data.projectId

    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title
    } else {
        const apiResult = await response.json()
        result.token = apiResult.data
    }
    return result
})

export const deleteToken = createAsyncThunk(actionTypes.deleteToken, async (requestData: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api login:\nUrl: ${JSON.stringify(apiRouts.deleteToken)}}`,)
    }
    //@ts-ignore
    const response = await fetch(apiRouts.deleteToken.api + (requestData.optional.tokenId as string),
        {
            method: apiRouts.deleteToken.method.toUpperCase(),
            headers: {
                ...requestData.headers,
                'Content-Type': 'application/json'
            }
        }
    )
    const result = {
        status: StatusExecutionRequest.SUCCESS,
        detail: "",
        title: "",
        //@ts-ignore
        token_id: requestData.optional.tokenId,
        //@ts-ignore
        projectId: requestData.optional.projectId,
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        const apiResult: BadRequest = await response.json()
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title
    }
    return result
})