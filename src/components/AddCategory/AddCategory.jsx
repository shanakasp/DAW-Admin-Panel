import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";
import Header from "../Header/Header";
import { storage } from "./Firebaseconfig";

const InputFileUpload = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryNameError, setCategoryNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleAddCategory = async () => {
    setCategoryNameError(null);
    setImageError(null);

    if (!categoryName.trim()) {
      setCategoryNameError("Please enter category name.");
      return;
    }

    if (imageUpload === null) {
      setImageError("Please upload an image for the category.");
      return;
    }

    setLoading(true);

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

    try {
      const snapshot = await uploadBytes(imageRef, imageUpload);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const apiUrl = "https://docback.hasthiya.org/category/placeCategory";
      const requestData = {
        category_name: categoryName,
        image_url: imageUrl,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setIsSnackbarOpen(true);

      setCategoryName("");
      setImageUpload(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error handling category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".tiff",
      ".eps",
      ".raw",
    ];
    const fileType = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

    if (!allowedTypes.includes(fileType)) {
      setImageError(
        "Invalid image type. Please select JPEG, PNG, GIF, TIFF, EPS, RAW images."
      );
      return;
    }

    setImageUpload(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const theme = createTheme({
    palette: {
      success: {
        main: "#10D44B",
      },
      error: {
        main: "#f44336",
      },
      info: {
        main: "#2196F3",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Header />

        <Container component="main" maxWidth="sm">
          <Snackbar
            open={isSnackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="success"
              onClose={handleCloseSnackbar}
            >
              Category successfully added
            </MuiAlert>
          </Snackbar>
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #2196f3",
              color: "primary",
              padding: 4,
            }}
          >
            <Typography variant="h4">Add Category</Typography>
            <Box mt={2}>
              <TextField
                label="Enter Category Name"
                type="text"
                fullWidth
                margin="normal"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              {categoryNameError && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  {categoryNameError}
                </Alert>
              )}

              <Typography
                variant="h6"
                style={{ marginBottom: "15px", marginTop: "12px" }}
              >
                Select Category Image
              </Typography>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload image
                <InputFileUpload
                  type="file"
                  accept=".jpg, .jpeg, .png, .gif, .tiff, .eps, .raw"
                  onChange={handleImagePreview}
                />
              </Button>
              <br></br>
              {imageError && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {imageError}
                </Alert>
              )}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                />
              )}
              <br></br>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Add Category"
                )}
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default AddCategory;
