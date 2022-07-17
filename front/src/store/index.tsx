import {configureStore,} from '@reduxjs/toolkit'
// import logger from 'redux-logger'
import globalReducer from "./reducers/globalReducer";

//@ts-ignore
const middlewareAuth = store => next => action => {
    console.log('middleware', JSON.stringify(action))
    const typeParts = (action["type"] as string).split('/')
    console.log(JSON.stringify(store))
    // if (typeParts[typeParts.length - 1] === 'fulfilled'){
    if (action.meta.requestStatus === 'fulfilled' && action.type !== "user/refresh/fulfilled") {
        if (action['payload']['detail'] === "Signature verification failed") {
            const newAction = {
                "type": "user/refresh/pending",
                "meta": {
                    "arg": {"headers": {"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjIsImlhdCI6MTY1ODA1NTc5OSwibmJmIjoxNjU4MDU1Nzk5LCJqdGkiOiJiNDUwY2JlMC0yMTU2LTQ5OGMtOGM3OC1lZjE0MDA4ZmI0MmIiLCJleHAiOjE2NjA2NDc3OTksInR5cGUiOiJyZWZyZXNoIiwiY3NyZiI6IjgwYmU0YzMwLWNmYzctNDM1MC05Zjk0LWI0YTBmZmY5ZGY1ZiJ9.HAgahrpQwwKBXwCy33R1HKdZxUufEBMMziNs4L_3VNc"}},
                    "requestStatus": "pending"
                }
            }
            const res = next(newAction)
            console.log("Result ", JSON.stringify(res))

        }

        const result = next(action)
        console.log("middleware result", JSON.stringify(result))
        return result

    } else {
        return next(action);
    }
}

const store = configureStore({
    reducer: {
        globalReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewareAuth),
})

export type RootState = ReturnType<typeof store.getState>

export default store


