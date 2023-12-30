import React, { useContext, useState } from "react";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";
import TimePicker from "react-time-picker";
import { Store } from "../Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../components/Maps";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Modal } from "@mui/material";
import DaySelector from "../components/DaySelector";
import ImageUploader from "../components/AddEventImages";
import { Image, Transformation } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/base";
import { AdvancedImage } from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen";
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "drvdi2fs3",
    apiKey: "132674462222646",
    apiSecret: "tYH88dSD9B-hvTFK6MOnCyCDcbg",
  },
});

const AddVenueForm = () => {
  const [name, setName] = useState("");
  const [slugs, setSlugs] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [opening, setOpening] = useState("");
  const [closing, setClosing] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { vendorInfo } = state;
  const [advanceBookings, setAdvanceBookings] = useState(""); // this is the number of days ahead of time for which bookings will be able to get made.
  const [selectedDays, setSelectedDays] = useState([]); // for off days
  const [multipleImages, setMultipleImages] = useState([]); // for multiple images
  const [uploaderModal, setUploaderModal] = useState(0); //
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const vendorId = vendorInfo._id;
    // Create FormData to send the image file
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slugs", slugs);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("price", price);
    formData.append("vendorId", vendorId);
    formData.append("capacity", capacity);
    formData.append("rating", 0);
    formData.append("numberOfReviews", 0);
    formData.append("description", description);
    formData.append("opening", opening);
    formData.append("closing", closing);
    formData.append("location", JSON.stringify(location));
    formData.append("longitude", location.lng);
    formData.append("latitude", location.lat);
    formData.append("advanceBookings", advanceBookings);
    formData.append("offDays", JSON.stringify(selectedDays));
    // Upload multiple images to Cloudinary
    const cloudinaryImages = [];
    // for (let i = 0; i < multipleImages.length; i++) {
    //   console.log("going in for loop", multipleImages[i].path);
    //   const result = await cloudinary.uploader.upload(multipleImages[i].path);
    //   cloudinaryImages.push(result.secure_url);
    //   console.logz("result", result);
    // }

    // Append the cloudinaryImages array to the formData object
    formData.append("cloudinaryImages", multipleImages);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Event added successfully");
      setShowMap(false);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  // Working for Google maps
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [confirmLocation, setConfirmLocation] = useState(false);
  const handleShowMap = () => {
    setShowMap(!showMap);
    if (!showMap) {
      setLocation(null);
    }
  };

  const handleConfirmLocation = () => {
    setShowMap(false);
    setConfirmLocation(true);
  };

  const handleSelectedDay = (days) => {
    setSelectedDays(days);
  };

  // these are the images getting from the child ImageUploader component
  const handleImageUpload = (uploadedImages) => {
    setMultipleImages(uploadedImages);

    setUploaderModal(0);
  };

  const UploaderOpen = () => {
    setUploaderModal(1);
  };

  const UploaderClose = () => {
    setUploaderModal(0);
  };

  return (
    // ...
    <>
      {showMap && (
        <Map
          location={location}
          setLocation={setLocation}
          handleConfirmLocation={handleConfirmLocation}
        />
      )}
      {console.log(location)}{" "}
      <Container
        maxWidth="xl"
        sx={{
          width: "80%",
          maxWidth: "80%",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add Event
        </Typography>
        <Modal open={uploaderModal} onClose={UploaderClose}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              padding: "24px",
              outline: "none",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Image Uploader</h2>
            <ImageUploader onUpload={handleImageUpload} />
          </div>
        </Modal>

        <Container
          maxWidth="lg"
          sx={{ border: 1, borderColor: "grey.300", borderRadius: 1 }}
        >
          <form onSubmit={handleSubmit}>
            {console.log(selectedDays)}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Slugs"
                  value={slugs}
                  onChange={(event) => setSlugs(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <label htmlFor="image-upload" style={{ marginBottom: "8px" }}>
                  Image Upload
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files[0])}
                  fullWidth
                  margin="normal"
                  required
                />

                <Grid item xs={6} sx={{ margin: "0.5rem" }}>
                  <div>
                    <button onClick={handleShowMap}>Toggle Map</button>
                    {location && <h4> Location Is Set </h4>}
                  </div>
                  <div style={{ marginBottom: "6px" }}>Opening Time</div>
                  <TimePicker
                    label="Opening Time"
                    value={opening}
                    onChange={(newValue) => {
                      setOpening(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  multiline
                  rows={4.5}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Price"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
                <TextField
                  label="Event Duration in Minutes"
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />

                <Grid item xs={6} sx={{ margin: "0.5rem" }}>
                  <div style={{ marginBottom: "6px" }}>Closing Time</div>
                  <TimePicker
                    label="Closing Time"
                    value={closing}
                    onChange={(newValue) => {
                      setClosing(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        required
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Day for advance booking"
                  value={advanceBookings}
                  onChange={(event) => setAdvanceBookings(event.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
                <DaySelector onSelectedDays={handleSelectedDay} />
                <Button style={{ marginTop: "1rem" }} onClick={UploaderOpen}>
                  {" "}
                  Select Images For venue
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Button
                    disabled={
                      !(
                        name &&
                        slugs &&
                        category &&
                        image &&
                        description &&
                        opening &&
                        closing &&
                        price &&
                        capacity &&
                        location
                      )
                    }
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
    </>
  );
  // ...
};

export default AddVenueForm;
