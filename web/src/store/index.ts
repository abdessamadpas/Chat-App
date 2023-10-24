import { configureStore } from '@reduxjs/toolkit'

// Slices
import messageSlice from './slices/messagesSlice'



 const store = configureStore({
    reducer: {
        message: messageSlice,
        
    },
})

export default store

