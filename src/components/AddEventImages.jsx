import React, { useState } from "react";

import { Button, Grid, Box } from "@mui/material";
import { Image, Transformation } from "@cloudinary/react";
import { AdvancedImage } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "drvdi2fs3",
    apiKey: "132674462222646",
    apiSecret: "tYH88dSD9B-hvTFK6MOnCyCDcbg",
  },
});
const ImageUploader = ({ onUpload }) => {
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const newImages = [...images];
    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push(e.target.files[i]);
    }
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Code to upload images to backend
    console.log(images);

    // Call the onUpload function with the uploaded images data
    onUpload(images);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const uploaders = images.map((image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "uploadImages");
        console.log(image);
        // Upload the image to Cloudinary and return the request object
        return axios.post(
          `https://api.cloudinary.com/v1_1/drvdi2fs3/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });

      // Calculate the total number of images being uploaded
      const totalImages = images.length;
      // Use axios.all to send multiple requests at once
      axios
        .all(uploaders)
        .then((responses) => {
          const urls = responses.map((response) => response.data.secure_url);
          // Call the onUpload function with the uploaded images URLs
          onUpload(urls);
        })
        .catch((error) => {
          console.error(error);
        });

      let completedUploads = 0;

      // Use axios.spread to update the progress bar
      axios
        .all(
          uploaders.map((uploader) =>
            uploader.then(() => {
              completedUploads++;
              const progress = Math.round(
                (completedUploads / totalImages) * 100
              );
              setUploadProgress(progress);
            })
          )
        )
        .then(() => {
          // Reset the progress bar after all uploads have completed
          setUploadProgress(0);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <label htmlFor="upload-image">
          <input
            id="upload-image"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button variant="contained" component="span">
            Select Venue Images
          </Button>
        </label>
        {uploadProgress > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 78,
              left: 0,
              width: `${uploadProgress}%`,
              height: "1rem",
              backgroundColor: "green",
              opacity: 0.5,
              transition: "width 0.2s ease-in-out",
            }}
          ></Box>
        )}
      </Box>
      <Grid container justifyContent="center">
        <Button
          variant="contained"
          onClick={handleUpload}
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          Upload
        </Button>
      </Grid>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <div>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                style={{ width: "100%", height: "10rem" }}
              />
              <Button type="button" onClick={() => handleRemoveImage(index)}>
                Remove
              </Button>
            </div>
          </Grid>
        ))}
      </Grid>
    </form>
  );
};

export default ImageUploader;
