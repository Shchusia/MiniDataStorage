import {config} from "./config";

interface PartApi {
    [key: string]: string
}

interface ApiData {
    method: "post" | "get" | "put" | "path" | "delete"
    api: string
}

interface Api {
    [key: string]: ApiData
}

const parts: PartApi = {
    auth: '/auth',
    project: '/project',
    token: '/token'
}

export const apiRouts: Api = {
    login: {
        method: "post",
        api: config.api.baseHost + config.api.baseRout + parts.auth + '/login'
    },
    refresh:{
        method: "post",
        api: config.api.baseHost + config.api.baseRout + parts.auth + '/refresh'},
    logout: {
        method: "delete",
        api: config.api.baseHost + config.api.baseRout + parts.auth + '/logout'},
    projects: {
        method: "get",
        api: config.api.baseHost + config.api.baseRout + parts.project + '/'
    },
    newProject: {
        method: "post",
        api: config.api.baseHost + config.api.baseRout + parts.project + '/',
    },
    getProject: {
        method: "get",
        api: config.api.baseHost + config.api.baseRout + parts.project + '/',
    },
    editProject: {
        method: "put",
        api: config.api.baseHost + config.api.baseRout + parts.project + '/',
    },
    deleteProject: {
        method: "delete",
        api: config.api.baseHost + config.api.baseRout + parts.project + '/',
    },
    restoreProject: {
        method: "get",
        api: config.api.baseHost + config.api.baseRout + parts.project + '/restore/',

    },
    createToken: {
        method: "post",
        api: config.api.baseHost + config.api.baseRout + parts.token + '/',
    },
    deleteToken: {
        method: "delete",
        api: config.api.baseHost + config.api.baseRout + parts.token + '/',

    },
}