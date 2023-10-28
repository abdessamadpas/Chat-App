import { configureStore } from '@reduxjs/toolkit'

// Slices
import messageSlice from './slices/messagesSlice'
import notificationSlice from './slices/notificationSlice'
import invitationsSlice from './slices/invitationsSlice'



const store = configureStore({
    reducer: {
        message: messageSlice,
        notification: notificationSlice,
        invitations: invitationsSlice,

    },
})

export type RootState = ReturnType<typeof store.getState>



