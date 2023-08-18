import React, { useContext, useState } from "react";
import AddRoomForm from "../../components/Forms/AddRoomForm";
import { imageUpload } from "../../api/utils";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddRoom = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [axiosSecure] = useAxiosSecure();
  const navigate = useNavigate();
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
        axiosSecure
          .post("/rooms", roomData)
          .then((data) => {
            toast.success(data.data.message);
            setLoading(false);
            setUploadButtonText("Uploaded!");
            navigate("/dashboard/my-listings");
          })
          .catch((error) => {
            const errorData = error.response.data;
            if (errorData.status === "fail") {
              toast.error(errorData.message);
            } else if (errorData.status === "error") {
              toast.error(errorData.message);
            } else {
              toast.error(err.message);
            }
            setLoading(false);
          });
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });

    event.target.reset();
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
