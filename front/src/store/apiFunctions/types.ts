import {StatusExecutionRequest} from "../../types/typesSystem";


export interface RequestBaseApi {
    data?: { [key: string]: any } | FormData | null
    headers?: { [key: string]: any }
    dataoptional?: { [key: string]: any }

}

export interface ResponseBaseApi {
    status: StatusExecutionRequest,
    responseData?: object
    error?: {
        detail: string
        title: string
    }
    authData?: {
        accessToken: string | null,
        refreshToken: string | null,
    }
}


export interface DataDecoratorRequest {
    functionToExecute: (data: RequestBaseApi) => Promise<ResponseBaseApi>
    functionData: RequestBaseApi
    accessToken: string,
    refreshToken: string
}