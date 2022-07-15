export const actionTypes = {
    // auth
    login: 'user/login',
    logout: 'user/logout',
    refresh: 'user/refresh',
    // projects
    projects: "projects/projects",
    createProject: "projects/createProject",
    editProject: "projects/editProject",
    getProject: "projects/getProject",
    deleteProject: "projects/deleteProject",
    restoreProject: "projects/restoreProject",
    //tokens
    createToken: "tokens/createToken",
    deleteToken: "tokens/deleteToken",
    //admins
    createAdmin: "admins/createAdmin",
    getAdmins: "admins/getAdmins",
    deleteAdmin: "admins/deleteAdmin",
    restoreAdmin: "admins/restoreAdmin",
    editAdmins: "admins/editAdmins",
    editSettingsAdmin: "admins/editSettingsAdmin",
}