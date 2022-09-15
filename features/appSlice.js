import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    requestResult: null,
    devicesResult: null,
}

export const appSlice = createSlice({
    name: "app",

    initialState,

    reducers: {
        requestSender: (state, action) => {
            state.requestResult = action.payload.requestResult
        },
        devicesSender: (state, action) => {
            state.devicesResult = action.payload.devicesResult
        },
    },
})

export const { requestSender } = appSlice.actions
export const { devicesSender } = appSlice.actions

export const selectRequestResult = (state) => state.app.requestResult
export const selectDevicesResult = (state) => state.app.devicesResult

export default appSlice.reducer