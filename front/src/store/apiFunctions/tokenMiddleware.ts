import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {BadRequest, BaseRequest, MainDataRequest} from "../../types/apiTypes";
import {StatusExecutionRequest} from "../../types/typesSystem";
import {decoratorAuth} from "../middlewares/decorator";
import {deleteProjectFunction} from "./projectFunctions";
import {createTokenFunction,deleteTokenFunction} from "./tokenFunctions";

export const createToken = createAsyncThunk(actionTypes.createToken, async (
    data: MainDataRequest) => {
    return await decoratorAuth({
        functionToExecute: createTokenFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})

export const deleteToken = createAsyncThunk(actionTypes.deleteToken, async (
        data: MainDataRequest
) => {
    return await decoratorAuth({
        functionToExecute: deleteTokenFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})