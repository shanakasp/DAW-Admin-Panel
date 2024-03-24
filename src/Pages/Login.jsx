import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material"; // Import Visibility and VisibilityOff icons
import {
  CircularProgress,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_LOGIN_ENDPOINT, API_BASE_URL } from "../ApiConfig";
import "../components/style.css";
const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    let usernameError = "";
    let passwordError = "";

    // Check if username is empty
    if (!values.username) {
      usernameError = "Username is required";
    }

    // Check if password is empty
    if (!values.password) {
      passwordError = "Password is required";
    }

    // Update errors state
    setErrors({
      username: usernameError,
      password: passwordError,
    });

    // If either field is empty, return without attempting login
    if (!values.username || !values.password) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}${ADMIN_LOGIN_ENDPOINT}`,
        values
      );

      if (response.data.status) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", values.username);
        localStorage.setItem("password", values.password);

        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/dd");
        }, 1000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    // Clear the validation error when the user types
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded w-400 h-400 border loginForm">
        <h3 className="mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="d-flex align-items-center">
              <Email sx={{ fontSize: 18, marginRight: 2 }} />
              <TextField
                name="username"
                autoComplete="off"
                placeholder="Enter Username"
                onChange={handleInputChange}
                className={`form-control rounded-3`}
                error={!!errors.username}
              />
            </div>
            <div
              className="text-danger mt-1"
              style={{ fontSize: "1.5rem", marginLeft: "35px" }}
            >
              {errors.username && <strong>{errors.username}</strong>}
            </div>
          </div>
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <Lock sx={{ fontSize: 18, marginRight: 2 }} />
              <TextField
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                onChange={handleInputChange}
                className={`form-control rounded-3`}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                error={!!errors.password}
              />
            </div>
            <div
              className="text-danger mt-1"
              style={{ fontSize: "1.5rem", marginLeft: "35px" }}
            >
              {errors.password && <strong>{errors.password}</strong>}
            </div>
          </div>
          <div
            className="text-danger mb-4 "
            style={{ fontSize: "1.5rem", marginLeft: "35px" }}
          >
            {error && <strong>{error}</strong>}
          </div>
          <div className="text-center">
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-50 rounded-15 mb-2"
              >
                Login
              </button>
            )}
          </div>
        </form>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Logging Successful
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Login;
