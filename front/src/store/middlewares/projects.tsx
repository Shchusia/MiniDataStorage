import {createAsyncThunk} from "@reduxjs/toolkit";
import {actionTypes} from "../actions";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {StatusExecutionRequest} from "../../types/typesSystem";
import {BadRequest, BaseRequest, FullProject, ResponseProject, TinyProject} from "../../types/apiTypes";

const convertFullProject2TinyProject = (project: FullProject): TinyProject => (
    {
        projectId: project.projectId,
        projectTitle: project.projectTitle,
        projectManager: project.projectManager,
        isDeleted: project.isDeleted
    })

export const projects = createAsyncThunk(actionTypes.projects, async (
    data: BaseRequest
) => {
    if (config.global.isDebug) {
        console.log(`Api getProjects:\n
        Url: ${JSON.stringify(apiRouts.projects)}\n`)
    }
    const response = await fetch(apiRouts.projects.api,
        {
            method: apiRouts.projects.method.toUpperCase(),
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
        projects: [],
    }
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        result.detail = apiResult.data.detail
        result.title = apiResult.data.title
    } else {
        result.projects = apiResult.data.projects
    }
    return result
})

export const createProject = createAsyncThunk(actionTypes.createProject, async (requestData: BaseRequest) => {
        if (config.global.isDebug) {
            console.log(`Api getProjects:\nUrl: ${apiRouts.newProject.toString()}\n`)
        }
        console.log(requestData.data)
        const response = await fetch(apiRouts.newProject.api,
            {
                method: apiRouts.newProject.method.toUpperCase(),
                body: JSON.stringify(requestData.data),
                headers: {
                    ...requestData.headers,
                    "Content-type": "application/json"
                }
            })
        const result = {
            status: StatusExecutionRequest.SUCCESS,
            detail: "",
            title: "",
            project: {},
            tinyProject: {},
        }
        if (response.status !== 200) {
            result.status = StatusExecutionRequest.REJECT
            const apiResult: BadRequest = await response.json()
            result.detail = apiResult.data.detail
            result.title = apiResult.data.title
        } else {
            const apiResult: ResponseProject = await response.json()
            const fullProject: FullProject = apiResult.data.project
            fullProject.tokens = apiResult.data.tokens
            result.project = fullProject
            result.tinyProject = convertFullProject2TinyProject(fullProject)
        }
        return result
    }
)

export const getProject = createAsyncThunk(actionTypes.getProject, async (requestData: BaseRequest) => {
        if (config.global.isDebug) {
            console.log(`Api getProject:\nUrl: ${apiRouts.getProject.toString()}\n`)
        }
        // @ts-ignore
        const response = await fetch(apiRouts.getProject.api + (requestData.data.projectId as string),
            {
                method: apiRouts.getProject.method.toUpperCase(),
                // body: JSON.stringify(requestData.data),
                headers: {
                    ...requestData.headers,
                    "Content-type": "application/json"
                }
            })
        const result = {
            status: StatusExecutionRequest.SUCCESS,
            detail: "",
            title: "",
            project: {},
            tinyProject: {},
            //@ts-ignore
            projectId: requestData.data.projectId
        }
        if (response.status !== 200) {
            if (response.status === 400) {
                //@ts-ignore
                result.project = null
                //@ts-ignore
                result.tinyProject = null

            } else {
                result.status = StatusExecutionRequest.REJECT
                const apiResult: BadRequest = await response.json()
                result.detail = apiResult.data.detail
                result.title = apiResult.data.title
            }
        } else {
            const apiResult: ResponseProject = await response.json()
            const fullProject: FullProject = apiResult.data.project
            fullProject.tokens = apiResult.data.tokens
            result.project = fullProject
            result.tinyProject = convertFullProject2TinyProject(fullProject)
        }
        return result
    }
)

export const editProject = createAsyncThunk(actionTypes.editProject, async (requestData: BaseRequest) => {
        if (config.global.isDebug) {
            console.log(`Api editProjects:\n
            Url: ${JSON.stringify(apiRouts.editProject)}\n
            Data ${JSON.stringify(requestData)}`)
        }
        // @ts-ignore
        const response = await fetch(apiRouts.editProject.api + (requestData.optional.projectId as string),
            {
                method: apiRouts.editProject.method.toUpperCase(),
                body: JSON.stringify(requestData.data),
                headers: {
                    ...requestData.headers,
                    "Content-type": "application/json"
                }
            })
        const result = {
            status: StatusExecutionRequest.SUCCESS,
            detail: "",
            title: "",
            project: {},
            tinyProject: {},
        }
        if (response.status !== 200) {
            result.status = StatusExecutionRequest.REJECT
            const apiResult: BadRequest = await response.json()
            result.detail = apiResult.data.detail
            result.title = apiResult.data.title
        } else {
            const apiResult: ResponseProject = await response.json()
            const fullProject: FullProject = apiResult.data.project
            fullProject.tokens = apiResult.data.tokens
            result.project = fullProject
            result.tinyProject = convertFullProject2TinyProject(fullProject)
        }
        return result
    }
)

export const deleteProject = createAsyncThunk(actionTypes.deleteProject, async (requestData: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api deleteProjects:\nUrl: ${apiRouts.deleteProject.toString()}\n`)
    }
    //@ts-ignore
    const response = await fetch(apiRouts.deleteProject.api + (requestData.optional.projectId as string),
        {
            method: apiRouts.deleteProject.method.toUpperCase(),
            headers: {
                ...requestData.headers,
                "Content-type": "application/json"
            }
        })
    const result = {
        status: StatusExecutionRequest.SUCCESS,
        detail: "",
        title: "",
        project: {},
        tinyProject: {},
        //@ts-ignore
        projectId: requestData.optional.projectId
    }
    if (response.status !== 200) {
        if (response.status === 400) {
            //@ts-ignore
            result.project = null
            //@ts-ignore
            result.tinyProject = null

        } else {
            result.status = StatusExecutionRequest.REJECT
            const apiResult: BadRequest = await response.json()
            result.detail = apiResult.data.detail
            result.title = apiResult.data.title
        }
    } else {
        const apiResult: ResponseProject = await response.json()
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens
        result.project = fullProject
        result.tinyProject = convertFullProject2TinyProject(fullProject)
    }
    return result
})
export const restoreProject = createAsyncThunk(actionTypes.restoreProject, async (requestData: BaseRequest) => {
    if (config.global.isDebug) {
        console.log(`Api restoreProject:\nUrl: ${apiRouts.editProject.toString()}\n`)
    }
    //@ts-ignore
    const response = await fetch(apiRouts.restoreProject.api + (requestData.optional.projectId as string),
        {
            method: apiRouts.restoreProject.method.toUpperCase(),
            headers: {
                ...requestData.headers,
                "Content-type": "application/json"
            }
        })
    const result = {
        status: StatusExecutionRequest.SUCCESS,
        detail: "",
        title: "",
        project: {},
        tinyProject: {},
        //@ts-ignore
        projectId: requestData.optional.projectId
    }
    if (response.status !== 200) {
        if (response.status === 400) {
            //@ts-ignore
            result.project = null
            //@ts-ignore
            result.tinyProject = null

        } else {
            result.status = StatusExecutionRequest.REJECT
            const apiResult: BadRequest = await response.json()
            result.detail = apiResult.data.detail
            result.title = apiResult.data.title
        }
    } else {
        const apiResult: ResponseProject = await response.json()
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens
        result.project = fullProject
        result.tinyProject = convertFullProject2TinyProject(fullProject)
    }
    return result
})


