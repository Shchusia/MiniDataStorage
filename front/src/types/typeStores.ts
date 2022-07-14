import {StatusExecutionRequest, TypeAlert} from "./typesSystem";
import {FullProject, TinyProject, TinyProjects} from "./apiTypes";

export interface ReducerAuth {
    isAuth: boolean | null
    accessToken: string | undefined | null
    refreshToken: string | undefined | null
}

export interface AlertType {
    type: TypeAlert
    text: string,
    title?: string,
    isShowed?: boolean
    ttl?: number
}

export interface ReducerAlerts {
    alerts: AlertType[]
}

export interface ReducerState {
    state: StatusExecutionRequest
}

export interface ReduceProjects {
    projects: TinyProjects
    detailProject: {
        [key: number]: FullProject|null
    }
}