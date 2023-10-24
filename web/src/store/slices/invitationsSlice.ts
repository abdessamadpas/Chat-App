import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { invitationType } from '../../types/index'; // Import your InvitationType type

interface InvitationsState {
  invitations: invitationType[];
}

const initialState: InvitationsState = {
  invitations: [],
};

const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    setInvitations: (state, action: PayloadAction<invitationType[]>) => {
      state.invitations = action.payload;
    },
    addInvitation: (state, action: PayloadAction<invitationType>) => {
      state.invitations.push(action.payload);
    },
  },
});

export const { setInvitations, addInvitation } = invitationsSlice.actions;
export default invitationsSlice.reducer;
