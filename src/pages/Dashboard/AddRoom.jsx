import React, { useState } from "react";
import AddRoomForm from "../../components/Forms/AddRoomForm";

const AddRoom = () => {
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const location = event.target.location.value;
    const title = event.target.title.value;
    const from = dates.startDate;
    const to = dates.endDate;
    const price = event.target.price.value;
    const guests = event.target.total_guest.value;
    const bedrooms = event.target.bedrooms.value;
    const bathrooms = event.target.bathrooms.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const image = event.target.image.files[0];
  };

  const handleImageChange = (image) => {
    setUploadButtonText(image.name);
  };

  return <AddRoomForm handleSubmit={handleSubmit} loading={loading} />;
};

export default AddRoom;
