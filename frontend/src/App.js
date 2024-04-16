/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  HashRouter as Router,  // 修改此处
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/main";
import Login from "../src/pages/login/login";
import Register from "./pages/login/rigester";
import api from "./api/login";
import { AuthContext } from "./context/AuthContext";
import { message } from "antd";
function ProtectedRoute({ children }) {
  let navigate = useNavigate();
  let location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const check = async () => {
      let uid = localStorage.getItem("uid");
      if (uid) {
        const result = await api.confirm(uid);
        console.log("确认登录状态", result.data);
        if (result.code === 200) {
          message.success("登录成功");
          setIsAuthenticated(true);
          navigate("/home"); // 提升认证状态
        } else {
          message.info("uid失效");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    check();
  }, [setIsAuthenticated]);

  useEffect(() => {
    const currentPath = location.pathname;
    if (
      !isAuthenticated &&
      currentPath !== "/" &&
      currentPath !== "/rigester"
    ) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, location.pathname]);

  if (isAuthenticated == null) {
    return null;
  }

  return children;
}

const routes = [
  { path: "/", element: <Login /> },
  { path: "/home/*", element: <Home /> },
  { path: "/rigester", element: <Register /> },
];
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 把 setIsAuthenticated 函数和 isAuthenticated 的值从这个context传递出去
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <ProtectedRoute>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </ProtectedRoute>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;