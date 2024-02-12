import axios from "axios";
import React from "react";
import { useState } from "react";

export const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegistration() {
    try {
      const user = { userid: username, password: password };
      const response = await axios.post(
        "https://localhost:8000/request/account/registration",
        user
      );
      return response;
    } catch (error) {
      console.log(error);
      if (error.response.status === 400)
        alert("Insufficient password strength");
      if (error.response.status === 409) alert("Username already taken");
      return false;
    }
  }

  return (
    <>
      <h2>Registration</h2>
      <div>
        Enter a username and a password. Password must:
        <ul>
          <li>Be at least 12 characters long</li>
          <li>Contain at least one number and one symbol</li>
          <li>Use both capital and lowercase letters</li>
        </ul>
      </div>
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
        <button type="button" onClick={handleRegistration}>
          Create Account
        </button>
      </div>
    </>
  );
};
