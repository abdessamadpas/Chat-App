export interface MessageTypes {
  _id?: string;
  chatId: string;
  sender: string;
  receiver: string;
  content: string;
  time: string;
}
export interface userType {
  _id: string;
  username: string;
  email: string;
  image: string;
  isInvited ?: boolean;
}
 export interface invitationType {
  _id?: string;
  name?: string;
  sender?: string;
  status?: string;
  time?: string;
 }
 