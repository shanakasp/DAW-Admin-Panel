import { Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import { storage } from "./Firebaseconfig";
import "./previewstyles.css";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { v4 } from "uuid";

function PreviewCategory() {
  const [notificationTimeout, setNotificationTimeout] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null); // Added state for the selected image file
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const uploadImageToFirebase = async (selectedFile) => {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`images/${selectedFile.name}`);

    try {
      await imageRef.put(selectedFile);
      const imageUrl = await imageRef.getDownloadURL();

      // Log success message
      console.log("Image uploaded to Firebase:", imageUrl);

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/category/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data.result.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
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
  };

  const handleEditSave = async () => {
    try {
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
        return;
      }

      // Save category name and/or image URL in the database
      await fetch(
        `http://localhost:8080/category/updateCategoryByID/${editCategoryId}`,
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
        "http://localhost:8080/category/getAllCategories"
      );
      const data = await response.json();
      setCategories(data.result.data);

      // Reset values to null
      setEditCategoryName(null);
      setEditImageUrl(null);
      setSelectedImageFile(null);

      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating category:", error);
      // Handle error as needed, e.g., set an error notification
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
        return;
      }

      // Update the selected image file when the user selects a new image
      setSelectedImageFile(selectedFile);
      setErrorMessage(""); // Clear error message when a valid file is selected
    }
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
                <div className="buttonsContainer">
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
                </div>
              </div>

              {/* Category Name with Link */}
              <Link
                to={`/form/${category.category_id}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" color="primary">
                  {category.category_name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Category</DialogTitle>
        {/* Display error message */}
        {showError && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}
        <DialogContent>
          {/* Display current name */}
          <div style={{ marginBottom: "10px" }}>
            <strong>Current Name:</strong> {editCategoryName}
          </div>

          {/* Display current image preview */}
          {imagePreview && (
            <div style={{ marginBottom: "10px" }}>
              <strong>Image Preview:</strong>{" "}
              <img
                src={imagePreview}
                alt="Image Preview"
                style={{ maxWidth: "100%", maxHeight: "150px" }}
              />
            </div>
          )}

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

          {/* Display current image preview */}
          {
            <div style={{ marginBottom: "10px" }}>
              <p>Current Image Preview:</p>
              <img
                src={editImageUrl}
                alt="Current Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          }
          <div>
            Select new image
            <br />
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .tiff, .eps, .raw"
              onChange={handleImageChange} // Handle the file change event
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreviewCategory;
