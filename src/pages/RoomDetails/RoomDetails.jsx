import React, { useState } from "react";
import Container from "../../components/shared/Container/Container";
import Header from "../../components/Rooms/Header";
import RoomInfo from "../../components/Rooms/RoomInfo";
import RoomReservation from "../../components/Rooms/RoomReservation";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader from "../../components/shared/Loader/Loader";
import { toast } from "react-hot-toast";
import NoDataFound from "../../components/shared/NavBar/NoDataFound";

const RoomDetails = () => {
  const [error, setError] = useState(null);
  const { id } = useParams();

  const { data: roomData = null, isLoading } = useQuery({
    queryKey: ["room-details", id],
    queryFn: async () => {
      try {
        const data = await axios.get(
          `http://localhost:5000/api/v1/rooms/${id}`
        );
        return data.data.data.room;
      } catch (error) {
        const { data } = error.response;
        if (data.status === "fail") {
          toast.error(data.message);
          setError({ errorMessage: data.message });
          return null;
        } else if (data.status === "error") {
          toast.error(data.message);
          setError({ errorMessage: data.message });
          return null;
        } else {
          toast.error(error.message);
          setError({ errorMessage: error.message });
          return null;
        }
      }
    },
  });

  if (isLoading) return <Loader />;

  // If Any Error Show It To UI
  if (error) {
    return (
      <NoDataFound
        message={error.errorMessage}
        address="/"
        label="Go To Home"
      />
    );
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <Header roomData={roomData} />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <RoomInfo roomData={roomData} />
            <div className="mb-10 md:col-span-3 order-first md:order-last">
              <RoomReservation roomData={roomData} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default RoomDetails;
