import React from 'react';
import axios from 'axios';
function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleSubmit = async () => {
    await axios
      .post('http://localhost:1337/auth/signin', {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('userId', response.data.user._id);
          localStorage.setItem('username', response.data.user.username);
          localStorage.setItem('token', response.data.token);
          window.location.reload();
        }
        //! this is just a sheat code to reload the page after login hhhhh
        //? this is not the best way to do it
        //? but i will do it like this for now
        //? i will change it later
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className=" h-screen w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Login</button>
      </div>
    </div>
  );
}

export default LoginPage;
