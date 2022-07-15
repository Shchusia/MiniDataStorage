import {
    AlertType,
    ReduceAdmins,
    ReduceProjects,
    ReducerAlerts,
    ReducerAuth,
    ReducerState
} from "../../types/typeStores";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {StatusExecutionRequest, TypeAlert} from "../../types/typesSystem";
import {login, logout, refresh} from "../middlewares/auth";
import {AdminData, FullProject, TinyProject, TinyProjects} from "../../types/apiTypes";
import {createProject, deleteProject, editProject, getProject, projects, restoreProject} from "../middlewares/projects";
import {createToken, deleteToken} from "../middlewares/tokens";
import {editSelfAdmin, getListAdmins} from "../middlewares/admins";


const initialState: (ReducerAuth
    & ReducerAlerts
    & ReducerState
    & ReduceProjects
    & ReduceAdmins
    ) = {
    alerts: [],
    isAuth: null,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    state: StatusExecutionRequest.EMPTY,
    projects: {},
    detailProject: {},
    admins: [],
    currentAdmin: null
}

const convertListTinyProjects = (projects: TinyProject[]) => {
    const res = {}
    for (const project of projects) {
        //@ts-ignore
        res[project.projectId] = project
    }
    return res
}


export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<AlertType>) => {
            console.log(state.alerts)
            const tmpAlerts = [...state.alerts]
            tmpAlerts.push(action.payload)
            state.alerts = tmpAlerts
        },
        setState: (state, action: PayloadAction<StatusExecutionRequest>) => {
            state.state = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(login.fulfilled, (state, action) => {
                    if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                        state.isAuth = action.payload.isAuth
                        // @ts-ignore
                        state.currentAdmin = action.payload.admin
                        state.accessToken = action.payload.at
                        state.refreshToken = action.payload.rt
                        localStorage.setItem("accessToken", action.payload.at)
                        localStorage.setItem("refreshToken", action.payload.rt)
                    } else {
                        //@ts-ignore
                        const alert = {
                            type: TypeAlert.ERROR,
                            text: action.payload.detail,
                            title: action.payload.title,
                            ttl: 10
                        }
                        const tmpAlert = [...state.alerts]
                        tmpAlert.push(alert)
                        state.alerts = tmpAlert

                    }
                }
            )
            .addCase(refresh.fulfilled, (state, action) => {

                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    state.isAuth = action.payload.isAuth
                    state.accessToken = action.payload.at
                    state.refreshToken = action.payload.rt
                    localStorage.setItem("accessToken", action.payload.at)
                    localStorage.setItem("refreshToken", action.payload.rt)
                } else {
                    // if (state.isAuth !== null) {
                    //     //@ts-ignore
                    //     const alert = {
                    //         type: TypeAlert.ERROR,
                    //         text: action.payload.detail,
                    //         title: action.payload.title,
                    //         ttl: 10
                    //     }
                    //     const tmpAlert = [...state.alerts]
                    //     tmpAlert.push(alert)
                    //     state.alerts = tmpAlert
                    // }
                    state.isAuth = false
                }
            })
            .addCase(logout.fulfilled, (state, action) => {
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    state.isAuth = action.payload.isAuth

                } else {
                    state.isAuth = false
                }
                localStorage.setItem("accessToken", '')
                localStorage.setItem("refreshToken", '')
            })
            .addCase(login.rejected, (state, action) => {
                state.state = StatusExecutionRequest.REJECT
                const alert = {
                    type: TypeAlert.ERROR,
                    text: "Unknown error in time login",
                    title: "System error",
                    ttl: 10
                }
                const tmpAlert = [...state.alerts]
                tmpAlert.push(alert)
                state.alerts = tmpAlert
            }).addCase(login.pending, (state, action) => {
            state.state = StatusExecutionRequest.PENDING
        }).addCase(refresh.rejected, (state, action) => {
            //@ts-ignoreq
            state.state = StatusExecutionRequest.REJECT

            const alert = {
                type: TypeAlert.ERROR,
                text: "Unknown error in time refresh",
                title: "System error",
                ttl: 10
            }
            const tmpAlert = [...state.alerts]
            tmpAlert.push(alert)
            state.alerts = tmpAlert
        }).addCase(refresh.pending, (state, action) => {
            //@ts-ignore
            state.state = StatusExecutionRequest.PENDING
        })
            .addCase(projects.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    state.projects = convertListTinyProjects(action.payload.projects)
                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert
                }
            })
            .addCase(projects.pending, (state, action) => {
                state.state = StatusExecutionRequest.PENDING
            })
            .addCase(projects.rejected, (state, action) => {
                state.state = StatusExecutionRequest.REJECT
                const alert = {
                    type: TypeAlert.ERROR,
                    text: "Unknown error in time get projects",
                    title: "System error",
                    ttl: 10
                }
                const tmpAlert = [...state.alerts]
                tmpAlert.push(alert)
                state.alerts = tmpAlert
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    //@ts-ignore
                    tmpDetails[action.payload.project.projectId] = action.payload.project
                    state.detailProject = tmpDetails
                    const tmpProjects = {...state.projects}
                    //@ts-ignore
                    tmpProjects[action.payload.tinyProject.projectId] = action.payload.tinyProject
                    state.projects = tmpProjects

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(getProject.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    const tmpProjects = {...state.projects}
                    if (action.payload.project === null) {

                        tmpDetails[action.payload.projectId] = null
                    } else {
                        //@ts-ignore
                        tmpDetails[action.payload.project.projectId] = action.payload.project
                        //@ts-ignore
                        tmpProjects[action.payload.tinyProject.projectId] = action.payload.tinyProject

                    }
                    state.detailProject = tmpDetails
                    state.projects = tmpProjects

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(editProject.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    const tmpProjects = {...state.projects}
                    //@ts-ignore
                    tmpDetails[action.payload.project.projectId] = action.payload.project
                    //@ts-ignore
                    tmpProjects[action.payload.tinyProject.projectId] = action.payload.tinyProject

                    state.detailProject = tmpDetails
                    state.projects = tmpProjects

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    const tmpProjects = {...state.projects}
                    if (action.payload.project === null) {

                        tmpDetails[action.payload.projectId] = null
                    } else {
                        //@ts-ignore
                        tmpDetails[action.payload.project.projectId] = action.payload.project
                        //@ts-ignore
                        tmpProjects[action.payload.tinyProject.projectId] = action.payload.tinyProject

                    }
                    state.detailProject = tmpDetails
                    state.projects = tmpProjects

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(restoreProject.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    const tmpProjects = {...state.projects}
                    if (action.payload.project === null) {

                        tmpDetails[action.payload.projectId] = null
                    } else {
                        //@ts-ignore
                        tmpDetails[action.payload.project.projectId] = action.payload.project
                        //@ts-ignore
                        tmpProjects[action.payload.tinyProject.projectId] = action.payload.tinyProject

                    }
                    state.detailProject = tmpDetails
                    state.projects = tmpProjects

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(createToken.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    const project = tmpDetails[action.payload.projectId]
                    //@ts-ignore
                    project.tokens.push(action.payload.token)
                    tmpDetails[action.payload.projectId] = project
                    state.detailProject = tmpDetails

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(deleteToken.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    const tmpDetails = {...state.detailProject}
                    const project = tmpDetails[action.payload.projectId]
                    console.log(project)
                    //@ts-ignore
                    const newArrayTokens = project?.tokens.filter(function (el) {
                        return el.accessTokenId !== action.payload.token_id
                    });
                    //@ts-ignore
                    project.tokens = newArrayTokens
                    tmpDetails[action.payload.projectId] = project
                    state.detailProject = tmpDetails

                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }

            })
            .addCase(getListAdmins.fulfilled, (state, action) => {
                state.state = StatusExecutionRequest.SUCCESS
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    state.admins = action.payload.admins
                } else {
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert
                }
            }).addCase(editSelfAdmin.fulfilled, (state, action) => {
                if (action.payload.status === StatusExecutionRequest.SUCCESS) {
                    // @ts-ignore
                    state.currentAdmin = action.payload.admin
                } else {
                    //@ts-ignore
                    const alert = {
                        type: TypeAlert.ERROR,
                        text: action.payload.detail,
                        title: action.payload.title,
                        ttl: 10
                    }
                    const tmpAlert = [...state.alerts]
                    tmpAlert.push(alert)
                    state.alerts = tmpAlert

                }
            }
        )
    }


})

export default globalSlice.reducer
export const {addAlert, setState} = globalSlice.actions
export const getAlerts = (state: RootState): AlertType[] => state.globalReducer.alerts
export const isAuthAdmin = (
    state: RootState): boolean | null => state.globalReducer.isAuth
export const getAccessToken = (state: RootState): string | undefined | null => state.globalReducer.accessToken;
export const getRefreshToken = (state: RootState): string | undefined | null => state.globalReducer.refreshToken;
export const getProjects = (state: RootState): TinyProjects => state.globalReducer.projects;
export const getFullProject = (idProject: number) => (state: RootState): FullProject | undefined | null => state.globalReducer.detailProject[idProject]
export const getAdmins = (state: RootState): AdminData[] => state.globalReducer.admins;
export const getCurrentAdmin = (state: RootState): AdminData | null => state.globalReducer.currentAdmin;
