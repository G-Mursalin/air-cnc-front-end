import React, { useContext, useState } from "react";
import Calender from "./Calender";
import Button from "../Button/Button";
import { AuthContext } from "../../providers/AuthProvider";
import BookingModal from "../Modal/BookingModal";
import { formatDistance } from "date-fns";
import { saveBooking } from "../../api/bookings";
import { toast } from "react-hot-toast";
import { updateRoomBookedStatus } from "../../api/rooms";
import { useNavigate } from "react-router-dom";

const RoomReservation = ({ roomData }) => {
  const { user, isUserHost } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [value, setValue] = useState({
    startDate: new Date(roomData?.from),
    endDate: new Date(roomData?.to),
    key: "selection",
  });
  // Calculating Total Price From Date
  const totalPrice =
    +formatDistance(new Date(roomData.to), new Date(roomData.from)).split(
      " "
    )[0] * roomData.price;

  // Creating Booking Information Data
  const [bookingInfo, srtBookingInfo] = useState({
    title: roomData.title,
    guest: {
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
    },
    host: roomData.host.email,
    location: roomData.location,
    price: totalPrice,
    from: value.startDate,
    to: value.endDate,
    roomId: roomData._id,
    image: roomData.image,
  });

  //  Calender Handler
  const handleSelect = (ranges) => {
    setValue({ ...value });
  };

  // Modal Handler
  const modalHandler = () => {
    // Send Booking Information to Database
    saveBooking(bookingInfo)
      .then((data) => {
        if (data.status === "fail") {
          toast.error(data.message);
        } else {
          toast.success(data.status);
          // Update the Room Booked Status
          updateRoomBookedStatus(roomData._id, true).then((data) => {
            if (data.status === "fail") {
              toast.error(data.message);
            } else {
              toast.success(data.status);
              // Navigate user to his or her dashboard booking page
              navigate("/dashboard/my-bookings");
            }
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });

    // Close The Model
    closeModal();
  };

  // Close The Modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {roomData.price}</div>
        <div className="text-neutral-600 font-light">night</div>
      </div>
      <hr />
      <div className="flex justify-center">
        <Calender value={value} handleSelect={handleSelect} />
      </div>
      <hr />
      <div onClick={() => setIsOpen(true)} className="p-4">
        <Button
          disabled={roomData.host.email === user.email || roomData.booked}
          label="Reserve"
        />
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
      <BookingModal
        bookingInfo={bookingInfo}
        modalHandler={modalHandler}
        closeModal={closeModal}
        isOpen={isOpen}
      />
    </div>
  );
};

export default RoomReservation;
