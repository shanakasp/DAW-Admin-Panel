import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header"; // Assuming Header is a component you've defined elsewhere

import { Visibility, VisibilityOff } from "@mui/icons-material";

function Profile() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Function to validate password strength
  const isStrongPassword = (password) => {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = () => {
    // Clear previous error messages
    setErrorMessages({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validate inputs
    const errors = {};

    if (!oldPassword.trim()) {
      errors.oldPassword = "Old password is required";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (!isStrongPassword(newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword =
        "Confirm passwords do not match with New Password";
    }

    setErrorMessages(errors);

    // If there are any errors, stop further processing
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Compare the entered old password with the locally stored password
    const storedPassword = localStorage.getItem("password");

    if (oldPassword !== storedPassword) {
      setErrorMessages({
        oldPassword: "Entered old password is incorrect",
        newPassword: "",
        confirmPassword: "",
      });
      return;
    }

    // Set loading to true
    setLoading(true);

    // Continue with the password change process
    const requestBody = {
      oldPassword,
      newPassword,
    };

    fetch("https://docback.hasthiya.org/admin/changeSuperAdminPassword/1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Password change failed. Please check your inputs.");
        }
      })
      .then((data) => {
        setMessage("Password changed successfully!");

        // Wait for 1 second before navigating
        setTimeout(() => {
          // Navigate to the home page ("/") after successful password change
          navigate("/");
        }, 1500);
      })
      .catch((error) => {
        setMessage("Password not changed. " + error.message);
        setErrorMessages({
          oldPassword: error.message,
          newPassword: "",
          confirmPassword: "",
        });
      })
      .finally(() => {
        // Set loading back to false after completion
        setLoading(false);
      });
  };

  return (
    <div>
      <Header />
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Profile</Typography>

          <Box mt={4}>
            <Typography variant="h5">Change Password</Typography>
            <TextField
              label="Old Password"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrorMessages((prevErrors) => ({
                  ...prevErrors,
                  oldPassword: "",
                }));
              }}
              fullWidth
              margin="normal"
              error={Boolean(errorMessages.oldPassword)}
              helperText={errorMessages.oldPassword}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toggleOldPasswordVisibility} edge="end">
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{ width: "100%" }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMessages((prevErrors) => ({
                  ...prevErrors,
                  newPassword: "",
                }));
              }}
              fullWidth
              margin="normal"
              error={Boolean(errorMessages.newPassword)}
              helperText={errorMessages.newPassword}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toggleNewPasswordVisibility} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{ width: "100%" }}
            />
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessages((prevErrors) => ({
                  ...prevErrors,
                  confirmPassword: "",
                }));
              }}
              fullWidth
              margin="normal"
              error={Boolean(errorMessages.confirmPassword)}
              helperText={errorMessages.confirmPassword}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{ width: "100%" }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={() => {
                handleChangePassword();
              }}
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Change Password"
              )}
            </Button>
            {message && (
              <Alert severity="success" sx={{ marginTop: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Profile;
