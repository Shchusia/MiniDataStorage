import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {MainDataRequest} from "../../types/apiTypes";
import {decoratorAuth} from "../middlewares/decorator";
import {createTokenFunction} from "./tokenFunctions";
import {
    createAdminFunction,
    deleteAdminFunction,
    editSelfAdminFunction,
    getListAdminsFunction,
    restoreAdminFunction
} from "./adminFunctions";

export const editSelfAdmin = createAsyncThunk(actionTypes.editSettingsAdmin, async (data: MainDataRequest) => {
    return await decoratorAuth({
        functionToExecute: editSelfAdminFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})

export const getListAdmins = createAsyncThunk(actionTypes.getAdmins, async (data: MainDataRequest) => {
    return await decoratorAuth({
        functionToExecute: getListAdminsFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})


export const createAdmin = createAsyncThunk(actionTypes.createAdmin, async (data: MainDataRequest) => {
    return await decoratorAuth({
        functionToExecute: createAdminFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})

export const deleteAdmin = createAsyncThunk(actionTypes.deleteAdmin, async (data: MainDataRequest) => {
    return await decoratorAuth({
        functionToExecute: deleteAdminFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})
export const restoreAdmin = createAsyncThunk(actionTypes.restoreAdmin, async (data: MainDataRequest) => {
    return await decoratorAuth({
        functionToExecute: restoreAdminFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})