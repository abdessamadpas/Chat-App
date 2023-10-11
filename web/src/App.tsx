import './App.css';
import { ChatPage } from './pages';
import LoginPage from './pages/loginPage';

function App() {
  const user = localStorage.getItem('userId');
  console.log(user);

  if (!user) {
    return <LoginPage />;
  }
  return <ChatPage />;
}

export default App;
