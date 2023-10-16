import './App.css';
import { ChatPage } from './pages';
import LoginPage from './pages/loginPage';
export const user = localStorage.getItem('userId');

function App() {
  if (!user) {
    return <LoginPage />;
  }
  return <ChatPage />;
}

export default App;
