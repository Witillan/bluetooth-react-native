import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    requestResult: null,
    permissions: null,
}

export const appSlice = createSlice({
    name: "app",

    initialState,

    reducers: {
        requestSender: (state, action) => {
            state.requestResult = action.payload.requestResult
        },
        permissionsSender: (state, action) => {
            state.permissions = action.payload.permissions
        },
    },
})

export const { requestSender } = appSlice.actions
export const { permissionsSender } = appSlice.actions

export const selectRequestResult = (state) => state.app.requestResult
export const selectPermissions = (state) => state.app.permissions

export default appSlice.reducer