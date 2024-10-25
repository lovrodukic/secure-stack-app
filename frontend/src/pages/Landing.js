import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

// check for oauth token in URL
const queryParameters = new URLSearchParams(window.location.search);
const oauth_token = queryParameters.get("token");

if (oauth_token) document.cookie = `token=${oauth_token}`;

export const Landing = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getContacts() {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (cookie) {
        try {
          const response = await axios.get(
            "https://localhost:8000/request/users",
            {
              headers: { authorization: `Bearer ${cookie}` },
            }
          );
          if (response.status === 200) setUsers(response.data);

          return response;
        } catch (error) {
          if (error.response.status === 401) alert("Unauthorized access");
          return false;
        }
      }
    }

    getContacts();
    auth.setAuthContext();
  });

  return (
    <div>
      <h2>Landing (Protected)</h2>
      <div> Authenticated as {auth.token}</div>
      <h2>Contacts:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.userid}>{user.userid}</li>
        ))}
      </ul>
    </div>
  );
};
