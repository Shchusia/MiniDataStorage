import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {MainDataRequest} from "../../types/apiTypes";
import {decoratorAuth} from "../middlewares/decorator";
import {
    createProjectFunction,
    deleteProjectFunction,
    editProjectFunction,
    getProjectFunction,
    getProjectsFunction, restoreProjectFunction
} from "./projectFunctions";


export const projects = createAsyncThunk(actionTypes.projects, async (
    data: MainDataRequest
) => {
    return await decoratorAuth({
        functionToExecute: getProjectsFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})

export const createProject = createAsyncThunk(actionTypes.createProject, async (
        data: MainDataRequest
    ) => {
        return await decoratorAuth({
            functionToExecute: createProjectFunction,
            functionData: data.data,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        })
    }
)

export const getProject = createAsyncThunk(actionTypes.getProject, async (
        data: MainDataRequest
    ) => {
        return await decoratorAuth({
            functionToExecute: getProjectFunction,
            functionData: data.data,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        })
    }
)

export const editProject = createAsyncThunk(actionTypes.editProject, async (
        data: MainDataRequest
    ) => {
        return await decoratorAuth({
            functionToExecute: editProjectFunction,
            functionData: data.data,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        })
    }
)

export const deleteProject = createAsyncThunk(actionTypes.deleteProject, async (
    data: MainDataRequest
) => {
    return await decoratorAuth({
        functionToExecute: deleteProjectFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})

export const restoreProject = createAsyncThunk(actionTypes.restoreProject, async (
    data: MainDataRequest
) => {
    return await decoratorAuth({
        functionToExecute: restoreProjectFunction,
        functionData: data.data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
    })
})


