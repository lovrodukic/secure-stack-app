import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

export const Home = () => {
  const { auth } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    auth.setAuthContext();
  });

  async function handleLogin() {
    try {
      const user = { userid: username, password: password };
      const response = await axios.post(
        "https://localhost:8000/request/account/login",
        user
      );
      if (response.status === 200) auth.onLogin(response.data);

      return response;
    } catch (error) {
      if (error.response.status === 401) alert("Invalid credentials");
      return false;
    }
  }

  async function handleOauth() {
    try {
      const response = await axios.post("https://localhost:8000/request");
      if (response.status === 200) window.location.href = response.data;

      return response;
    } catch (error) {
      if (error.response.status === 401) alert("Oauth error");
      return false;
    }
  }

  return (
    <>
      <h2>Home (Public)</h2>
      <div>
        <label>
          Username:{" "}
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          ></input>
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          ></input>
        </label>
      </div>
      <div>
        <button type="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>
      <div>
        <button type="button" onClick={handleOauth}>
          Sign in with Google
        </button>
      </div>
    </>
  );
};
