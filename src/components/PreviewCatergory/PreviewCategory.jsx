import { Delete, Edit } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { storage } from "../AddCategory/Firebaseconfig";
import Header from "../Header/Header";
import "./previewstyles.css";

const MAX_CHARACTERS = 50;

function InputFileUpload({ onChange }) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload image
      <input
        type="file"
        style={{ display: "none" }}
        onChange={onChange}
        accept=".jpg, .jpeg, .png, .gif, .tiff, .eps, .raw"
        aria-label="Upload image"
      />
    </Button>
  );
}

function PreviewCategory() {
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);

  useEffect(() => {
    fetch("https://docback.hasthiya.org/category/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data.result.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setNotification(null); // Clear any existing notifications
    clearNotificationTimeout();
    setEditImageUrl(null);
  };

  const clearNotificationTimeout = () => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
  };

  const filteredCategories = Array.isArray(categories)
    ? categories
        .filter(
          (category) =>
            category.category_name &&
            category.category_name
              .toLowerCase()
              .startsWith(search.toLowerCase())
        )
        .sort((a, b) => a.category_name.localeCompare(b.category_name))
    : [];

  const handleEditClick = (categoryId, categoryName, imageUrl) => {
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
    setEditImageUrl(imageUrl);
    setIsEditDialogOpen(true);
    setShowError(false);
  };

  const handleEditSave = async () => {
    try {
      setIsSaving(true);

      // Check if any changes have been made
      if (
        editCategoryName.trim() ===
          categories
            .find((c) => c.category_id === editCategoryId)
            .category_name.trim() &&
        !selectedImageFile
      ) {
        setErrorMessage("Nothing has changed");
        setShowError(true);
        return;
      }

      let requestBody = {};

      // Validate category name
      if (editCategoryName.trim()) {
        requestBody.category_name = editCategoryName;
      }

      // Validate image
      if (selectedImageFile) {
        const imageRef = ref(
          storage,
          `images/${selectedImageFile.name + v4()}`
        );
        const snapshot = await uploadBytes(imageRef, selectedImageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        requestBody.image_url = imageUrl;
      }

      if (!editCategoryName.trim()) {
        setErrorMessage("Category name cannot be empty");
        setShowError(true);
        return;
      }

      // Save category name and/or image URL in the database
      await fetch(
        `https://docback.hasthiya.org/category/updateCategoryByID/${editCategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Fetch updated data from the server
      const response = await fetch(
        "https://docback.hasthiya.org/category/getAllCategories"
      );
      const data = await response.json();
      setCategories(data.result.data);

      // Show success notification
      setIsUpdateSuccessful(true);
      setTimeout(() => {
        setIsUpdateSuccessful(false);
      }, 3000);

      // Reset values to null
      setEditCategoryName(null);
      setEditImageUrl(null);
      setSelectedImageFile(null);

      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating category:", error);
      // Handle error as needed, e.g., set an error notification
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    // Update the selected image file when the user selects a new image
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if the file type is allowed
      const allowedTypes = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".tiff",
        ".eps",
        ".raw",
      ];
      const fileType = selectedFile.name.substring(
        selectedFile.name.lastIndexOf(".")
      );

      if (!allowedTypes.includes(fileType.toLowerCase())) {
        setErrorMessage(
          "Only image files are allowed (jpg, jpeg, png, gif, tiff, eps, raw)"
        );
        setShowError(true);
        return;
      }

      // Update the selected image file when the user selects a new image
      setSelectedImageFile(selectedFile);
      setErrorMessage(""); // Clear error message when a valid file is selected
      setShowError(false); // Hide the error message when a valid file is selected

      // Read the selected image file and display it in the preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Set image preview URL
        setEditImageUrl(reader.result); // Update editImageUrl with the new image URL
      };
      reader.readAsDataURL(selectedFile); // Read the file as data URL
    }
  };

  const handleDeleteClick = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Show loading circle for 1 second before starting deletion
    setIsDeleting(true);
    setTimeout(async () => {
      try {
        await fetch(
          `https://docback.hasthiya.org/category/deleteCategoryByID/${deleteCategoryId}`,
          {
            method: "DELETE",
          }
        );

        const response = await fetch(
          "https://docback.hasthiya.org/category/getAllCategories"
        );
        const data = await response.json();
        setCategories(data.result.data);

        // Reset values to null
        setEditCategoryName(null);
        setEditImageUrl(null);
        setSelectedImageFile(null);

        // Set isDeleteSuccessful to true after successful delete
        setIsDeleteSuccessful(true);
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
      }
    }, 600); // 1000 milliseconds = 1 second
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      <Header setSearch={setSearch} />

      <div className="categoryContainer">
        {filteredCategories.map((category, index) => (
          <Card key={category.category_id} className={`card cardHover`}>
            <CardContent>
              <div className="imageContainer">
                <Link
                  to={`/form/${category.category_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={category.image_url}
                    alt={category.category_name}
                    className="categoryImage"
                  />
                </Link>

                {/* Two Buttons */}
                <div className="buttonsContainer" style={{ display: "flex" }}>
                  {/* Edit Icon */}
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleEditClick(
                        category.category_id,
                        category.category_name,
                        category.image_url
                      )
                    }
                  >
                    <Edit />
                  </IconButton>

                  {/* Category Name with Link */}
                  <Link
                    to={`/form/${category.category_id}`}
                    style={{ textDecoration: "none", flex: 1 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        fontSize: `${
                          category.category_name.length > 15 ? "14px" : "20px"
                        }`,
                        lineHeight: `${
                          category.category_name.length > 15 ? "1.4" : "1.2"
                        }`,
                        marginTop: "10px",
                        transition: "color 0.3s ease-in-out",
                        width: "250px",
                        textTransform: "none",
                        whiteSpace: "pre-line",
                        // Allows for line breaks
                      }}
                    >
                      <div className="categoryname1">
                        {category.category_name}
                      </div>
                    </Button>
                  </Link>

                  {/* Delete Icon */}
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(category.category_id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
        sx={{
          alignItems: "center",
          textAlign: "center", // Center the content
          width: "100%", // Set a maximum width for the dialog
          margin: "auto", // Center the dialog horizontally
        }}
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "left", marginLeft: "-20px" }}>
            {" "}
            <strong>Edit Category</strong>
          </div>
          <Button
            variant="contained"
            onClick={handleEditDialogClose}
            color="primary"
            style={{
              borderRadius: "5px",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <CloseIcon style={{ fontSize: "medium" }} />
          </Button>
        </DialogTitle>

        <DialogContent>
          {/* Display current name */}

          <div style={{ marginBottom: "10px", textAlign: "left" }}>
            <strong>Current Name:</strong> {editCategoryName}
          </div>

          {/* Input for new name */}
          <TextField
            autoFocus
            margin="dense"
            id="categoryName"
            label="New Category Name"
            type="text"
            fullWidth
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
          />
          {/* Display error message */}
          {showError && (
            <Alert
              severity="error"
              onClose={() => {
                setShowError(false);
              }}
              sx={{ margin: 2 }}
            >
              {errorMessage}
            </Alert>
          )}
          {/* Display current image preview */}
          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <strong>Current Image Preview:</strong>
          </div>
          {editImageUrl && (
            <div
              className="current_image_headline"
              style={{ textAlign: "left" }}
            >
              <img
                src={editImageUrl}
                alt="Current Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  marginTop: "5px",
                }}
              />
            </div>
          )}
          <div className="new_image">
            <div className="selecctnewimage" style={{ textAlign: "left" }}>
              {" "}
              <strong> Select new image:</strong>
              <div className="new_image_select">
                <InputFileUpload onChange={handleImageChange} />
              </div>
            </div>

            <div
              className="twobuttons"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginRight: "-10px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleEditSave}
                color="primary"
                style={{
                  width: "100px", // Adjust the width value as needed
                  // Add other styles if necessary
                }}
              >
                {isSaving ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={handleCancelDelete}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle
            id="form-dialog-title"
            style={{ fontSize: "20px", fontWeight: "bold", color: "red" }}
          >
            Warning!
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{
                fontSize: "17px",
                color: "black",
                maxWidth: "none", // Allow content to spread along width
                marginRight: "10px", // Remove margin
              }}
            >
              Are you sure you want to delete this category? <br></br> This will
              remove category and relevant questions too.
            </DialogContentText>
            <DialogActions
              className="buttons"
              style={{ justifyContent: "flex-end" }}
            >
              <Button
                onClick={handleCancelDelete}
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                  minWidth: "120px",
                  border: "1px solid #add8e6", // Light blue border
                  marginRight: "5px", // Gap of 5px
                }}
                startIcon={<CancelIcon />} // Add CancelIcon as a start icon
              >
                Cancel
              </Button>

              {/* Delete Button */}
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                  minWidth: "120px",
                  border: "1px solid #add8e6", // Light blue border
                }}
                endIcon={
                  <DeleteIcon
                    style={{ fontSize: "1.5rem", marginLeft: "5px" }}
                  />
                } // Increase icon size
              >
                Delete
                {isDeleting && (
                  <CircularProgress
                    size={24}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: -12,
                      marginLeft: -12,
                      color: "#0000FF", // Hex code for blue
                    }}
                  />
                )}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Snackbar
          open={isUpdateSuccessful}
          autoHideDuration={3000}
          onClose={() => setIsUpdateSuccessful(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={setIsUpdateSuccessful}
          >
            Updated successfully
          </MuiAlert>
        </Snackbar>
        {/* Snackbar for Successful Delete */}
        <Snackbar
          open={isDeleteSuccessful}
          autoHideDuration={3000}
          onClose={() => setIsDeleteSuccessful(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={() => setIsDeleteSuccessful(false)}
          >
            Category deleted successfully
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
}

export default PreviewCategory;
