import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export let AuthContext = createContext(null);

export default function AuthContextProvider({children}) {
  const [loginData, setloginData] = useState(null);
  const [userData, setUserData] = useState(null);


function saveLoginData() {
  let encodedToken = localStorage.getItem("token");
  let user = localStorage.getItem("user");


  let decodedToken = jwtDecode(encodedToken);

  setloginData(decodedToken);

  setUserData(user);


}

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

useEffect(() => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (token) {
    const decodedToken = jwtDecode(token);
    setloginData(decodedToken);
  }

  if (savedUser) {
    setUserData(JSON.parse(savedUser));
  }
}, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          loginData,
          setloginData,
          saveLoginData,
          logout,
          setUserData,
          userData,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
