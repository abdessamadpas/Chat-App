import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notificationType } from '../../types/index'; // Import your InvitationType type

interface NotificationState {
  Notification: notificationType[];
}

const initialState: NotificationState = {
  Notification: [],
};

const NotificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<notificationType[]>) => {
      state.Notification = action.payload;
    },
    addNotification: (state, action: PayloadAction<notificationType>) => {
      state.Notification.push(action.payload);
    },
    deleteNotifications: (state, action: PayloadAction<notificationType>) => {
        state.Notification = []
    },
    

  },
});

export const { setNotification, addNotification } = NotificationSlice.actions;
export default NotificationSlice.reducer;
