export interface Project {
    projectManager: string,
    projectManagerEmail: string,
    projectTitle: string,
    projectDescription: string
}

export interface LoginUser {
    email: string,
    password: string
}

export interface BaseRequest {
    data?: { [key: string]: any } | FormData | null
    headers?: { [key: string]: any }
    optional?: { [key: string]: any }
}

export interface MainDataRequest {
    data: BaseRequest,
    accessToken: string,
    refreshToken: string
}

export interface BadRequest {
    status: string,
    data: {
        code: number,
        title: string,
        detail: string,
    }
}

export interface ResponseProject {
    status: string
    data: {
        project: {
            projectManager: string,
            projectManagerEmail: string,
            projectTitle: string,
            projectDescription: string,
            projectId: number,
            isDeleted: true,
            created: Date
        },
        tokens: Token[]
    }
}

export interface TinyProject {
    projectId: number,
    projectTitle: string,
    projectManager: string,
    isDeleted: boolean
}

export interface Token {
    accessTokenId: number,
    accessToken: string,
    isWrite: boolean,
    expired: Date

}

export interface FullProject {
    projectManager: string,
    projectManagerEmail: string,
    projectTitle: string,
    projectDescription: string,
    projectId: number,
    isDeleted: boolean,
    created: Date,
    tokens?: Token[]
}

export interface TinyProjects {
    [key: number]: TinyProject
}

export interface AdminData {
    adminId: number,
    adminName: string,
    adminEmail: string,
    isDeleted: boolean
}

export interface EditCreateAdminData {
    email: string,
    password?: string,
    name: string
}

