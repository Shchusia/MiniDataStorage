import {RequestBaseApi, ResponseBaseApi} from "./types";
import {config} from "../../configs/config";
import {apiRouts} from "../../configs/apis";
import {StatusExecutionRequest} from "../../types/typesSystem";
import {FullProject} from "../../types/apiTypes";
import {convertFullProject2TinyProject} from "../middlewares/projects";


export async function getProjectsFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api getProjects:\n
       Url: ${JSON.stringify(apiRouts.projects)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    const response = await fetch(apiRouts.projects.api,
        {
            method: apiRouts.projects.method.toUpperCase(),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
    }
    const apiResult = await response.json()
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        result.responseData = {
            projects: apiResult.data.projects
        }
    }
    return result
}

export async function createProjectFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api newProject:\n
       Url: ${JSON.stringify(apiRouts.newProject)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    const response = await fetch(apiRouts.newProject.api,
        {
            method: apiRouts.newProject.method.toUpperCase(),
            body: JSON.stringify(data.data),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
    }
    const apiResult = await response.json()
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens

        result.responseData = {
            project: fullProject,
            tinyProject: convertFullProject2TinyProject(fullProject)
        }
    }
    return result
}

export async function getProjectFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api getProject:\n
       Url: ${JSON.stringify(apiRouts.getProject)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    // @ts-ignore
    const response = await fetch(apiRouts.getProject.api + (data?.data?.projectId as string),
        {
            method: apiRouts.getProject.method.toUpperCase(),
            headers: {
                ...data.headers,
                "Content-type": "application/json"

            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {
            //@ts-ignore
            projectId: data?.data?.projectId
        }
    }
    const apiResult = await response.json()
    if (response.status !== 200) {
        if (response.status === 400) {
            result.responseData = {
                project: null,
                tinyProject: null
            }
        } else {
            result.status = StatusExecutionRequest.REJECT
            result.error = {
                detail: apiResult.data.detail,
                title: apiResult.data.title
            }
        }
    } else {
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens

        result.responseData = {
            ...result.responseData,
            project: fullProject,
            tinyProject: convertFullProject2TinyProject(fullProject)
        }
    }
    return result
}

export async function editProjectFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api editProject:\n
       Url: ${JSON.stringify(apiRouts.editProject)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    // @ts-ignore
    const response = await fetch(apiRouts.editProject.api + (data?.data?.projectId as string),
        {
            method: apiRouts.editProject.method.toUpperCase(),
            body: JSON.stringify(data.data),
            headers: {
                ...data.headers,
                "Content-type": "application/json"
            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
    }
    const apiResult = await response.json()
    if (response.status !== 200) {
        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens

        result.responseData = {
            project: fullProject,
            tinyProject: convertFullProject2TinyProject(fullProject)
        }
    }
    return result
}

export async function deleteProjectFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api deleteProject:\n
       Url: ${JSON.stringify(apiRouts.deleteProject)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    // @ts-ignore
    const response = await fetch(apiRouts.deleteProject.api + (data.optional.projectId as string),
        {
            method: apiRouts.deleteProject.method.toUpperCase(),
            body: JSON.stringify(data.data),
            headers: {
                ...data.headers,
                "Content-type": "application/json"
            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {
            //@ts-ignore
            projectId: data?.data?.projectId
        }
    }
    const apiResult = await response.json()
    if (response.status !== 200) {
        if (response.status === 400) {
            result.responseData = {
                project: null,
                tinyProject: null
            }
        }
        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens

        result.responseData = {
            ...result.responseData,
            project: fullProject,
            tinyProject: convertFullProject2TinyProject(fullProject)
        }
    }
    return result
}

export async function restoreProjectFunction(data: RequestBaseApi): Promise<ResponseBaseApi> {
    if (config.global.isDebug) {
        console.log(`Api restoreProject:\n
       Url: ${JSON.stringify(apiRouts.restoreProject)}\n
        Data: ${JSON.stringify(data)}`,)
    }
    // @ts-ignore
    const response = await fetch(apiRouts.restoreProject.api + (data.optional.projectId as string),
        {
            method: apiRouts.restoreProject.method.toUpperCase(),
            body: JSON.stringify(data.data),
            headers: {
                ...data.headers,
                "Content-type": "application/json"
            },
        }
    )
    const result: ResponseBaseApi = {
        status: StatusExecutionRequest.SUCCESS,
        responseData: {
            //@ts-ignore
            projectId: data?.data?.projectId
        }
    }
    const apiResult = await response.json()
    if (response.status !== 200) {
        if (response.status === 400) {
            result.responseData = {
                project: null,
                tinyProject: null
            }
        }
        result.status = StatusExecutionRequest.REJECT
        result.error = {
            detail: apiResult.data.detail,
            title: apiResult.data.title
        }
    } else {
        const fullProject: FullProject = apiResult.data.project
        fullProject.tokens = apiResult.data.tokens

        result.responseData = {
            ...result.responseData,
            project: fullProject,
            tinyProject: convertFullProject2TinyProject(fullProject)
        }
    }
    return result
}