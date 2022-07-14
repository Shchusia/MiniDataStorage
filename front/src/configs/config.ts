// require('dotenv').config()

export enum EnumEnvs {
    PROD = 'production',
    DEV = 'dev'
}

const back_port = process.env.REACT_APP_BACKEND_PORT || "8001"
const host = window.location.protocol + "//" + window.location.host;
console.log(host)
console.log(back_port)

export interface Config {
    api: {
        baseRoutStatic: string,
        baseRout: string,
        baseHost: string,
    },
    global: {
        isDebug: boolean,
    }
}

const dev: Config = {
    api: {
        baseRoutStatic: "/static",
        baseRout: "/api/mdt",
        // baseHost: `http://back:${back_port}`,
        baseHost: window.location.protocol + "//" + window.location.host,
        // baseHost: 'http://localhost:8000'
    },
    global: {
        isDebug: false,
    }
}

const prod: Config = {
    api: {
        baseRoutStatic: "/static",
        baseRout: "/mdt/api",
        baseHost: `${host}:${back_port}`,
    },
    global: {
        isDebug: false,
    }
}

export const config: Config = process.env.REACT_APP_MODE === EnumEnvs.PROD
    ? prod
    : dev;
