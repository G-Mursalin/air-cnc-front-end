import React, { useContext, useState } from "react";
import AddRoomForm from "../../components/Forms/AddRoomForm";
import { imageUpload } from "../../api/utils";
import { AuthContext } from "../../providers/AuthProvider";
import { saveRoom } from "../../api/rooms";
import { toast } from "react-hot-toast";

const AddRoom = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

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

    //  Upload Image to ImgBB
    imageUpload(image)
      .then((data) => {
        //  Save Room Information to Database
        const roomData = {
          location,
          title,
          from,
          to,
          price,
          guests,
          bedrooms,
          bathrooms,
          description,
          category,
          image: data.data.display_url,
          host: {
            name: user?.displayName,
            image: user?.photoURL,
            email: user?.email,
          },
        };

        // Post Room Data to Database
        saveRoom(roomData)
          .then((data) => {
            toast.success(data.status);
            setLoading(false);
            setUploadButtonText("Uploaded!");
          })
          .catch((err) => {
            toast.error(err.message);
            setLoading(false);
          });
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  const handleImageChange = (img) => {
    setUploadButtonText(img.name);
  };

  const handleSelectDates = (ranges) => {
    setDates({ ...ranges.selection });
  };

  return (
    <AddRoomForm
      handleSubmit={handleSubmit}
      loading={loading}
      handleImageChange={handleImageChange}
      uploadButtonText={uploadButtonText}
      dates={dates}
      handleDates={handleSelectDates}
    />
  );
};

export default AddRoom;
