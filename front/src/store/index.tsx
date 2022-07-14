import {configureStore,} from '@reduxjs/toolkit'
// import logger from 'redux-logger'
import globalReducer from "./reducers/globalReducer";

const store = configureStore({
    reducer: {
        globalReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>

export default store