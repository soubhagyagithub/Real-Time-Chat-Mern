import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Backdrop, CircularProgress, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/chatapi";
import Toaster from "../Components/ui/Toaster";
const Login = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [logInStatus, setLogInStatus] = React.useState("");
  const [signInStatus, setSignInStatus] = React.useState("");

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const LoginHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await api.post("/user/login", data, config);
      setLogInStatus({ msg: "Success", key: Math.random() });
      setLoading(false);
      localStorage.setItem("UserData", JSON.stringify(response));
      navigate("/app/chat/welcome");
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        setLogInStatus({
          msg: "Invalid User name or Password",
          key: Math.random(),
        });
      }
      if (error.response.status === 400) {
        setLogInStatus({
          msg: "All fields are mandatory",
          key: Math.random(),
        });
      }
      setLoading(false);
    }
  };

  const SignUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const response = await api.post("/user/register", data, config);
      setSignInStatus({ msg: "Success", key: Math.random() });
      navigate("/app/chat/welcome");
      localStorage.setItem("UserData", JSON.stringify(response));
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response.status === 405) {
        setSignInStatus({
          msg: "User with this email ID already Exists",
          key: Math.random(),
        });
      }
      if (error.response.status === 406) {
        setSignInStatus({
          msg: "User Name already Taken, Please take another one",
          key: Math.random(),
        });
      }
      if (error.response.status === 400) {
        setSignInStatus({
          msg: "All fields are mandatory",
          key: Math.random(),
        });
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
        <div className="img-container">
          <img src={logo} alt="logo" />
        </div>
        {showLogin && (
          <div className="login-box">
            <p className="login-text">Login to your Account</p>
            <TextField
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              color="secondary"
              name="username"
              onChange={changeHandler}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  LoginHandler();
                }
              }}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onChange={changeHandler}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  LoginHandler();
                }
              }}
            />
            <Button variant="outlined" color="secondary" onClick={LoginHandler}>
              Login
            </Button>
            <p>
              Don't have an Account?{" "}
              <span
                className="hyper"
                onClick={() => {
                  setShowLogin(false);
                }}
              >
                Sign Up
              </span>
            </p>
            {logInStatus ? (
              <Toaster key={logInStatus.key} message={logInStatus.msg} />
            ) : null}
          </div>
        )}
        {!showLogin && (
          <div className="login-box">
            <p className="login-text">Create your Account</p>
            <TextField
              id="standard-basic"
              label="Enter User Name"
              variant="outlined"
              color="secondary"
              name="username"
              onChange={changeHandler}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  SignUpHandler();
                }
              }}
            />
            <TextField
              id="standard-basic"
              label="Enter Email Address"
              variant="outlined"
              color="secondary"
              name="email"
              onChange={changeHandler}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  SignUpHandler();
                }
              }}
            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              color="secondary"
              name="password"
              onChange={changeHandler}
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  SignUpHandler();
                }
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={SignUpHandler}
            >
              Sign Up
            </Button>
            <p>
              Already have an Account?{" "}
              <span
                className="hyper"
                onClick={() => {
                  setShowLogin(true);
                }}
              >
                Log In
              </span>
            </p>
            {signInStatus ? (
              <Toaster key={signInStatus.key} message={signInStatus.msg} />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
