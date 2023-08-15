import { useContext, useEffect, useState } from "react";
import { deleteBooking, getBookingsForHost } from "../../api/bookings";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import TableRow from "../../components/Dashboard/TableRow";
import DeleteModal from "../../components/Modal/DeleteModal";
import { updateRoomBookedStatus } from "../../api/rooms";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [refetchBookings, setRefetchBookings] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Handle Modal
  const modalHandler = () => {
    // Delete the selected booking information from database
    deleteBooking(selectedData._id)
      .then((data) => {
        if (data.status === "fail") {
          toast.error(data.message);
        } else {
          toast.success(data.status);
          setRefetchBookings((pre) => !pre);
          // Update deleted booking room booked status
          updateRoomBookedStatus(selectedData.roomId, false).then((data) => {
            if (data.status === "fail") {
              toast.error(data.message);
            }
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
    // Closed the modal
    closeModal();
  };

  // Closed The Modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Open Modal
  const openModal = () => {
    setIsOpen(true);
  };

  // Fetch Bookings Data From Database
  useEffect(() => {
    getBookingsForHost(user.email)
      .then((data) => {
        if (data.status === "fail") {
          toast.error(data.message);
        } else {
          toast.success(data.status);
          setBookings(data.data.bookings);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [user, refetchBookings]);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    From
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    To
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <TableRow
                    setSelectedData={setSelectedData}
                    booking={booking}
                    key={booking._id}
                    openModal={openModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedData && (
        <DeleteModal
          modalHandler={modalHandler}
          isOpen={isOpen}
          closeModal={closeModal}
          id={selectedData._id}
        />
      )}
    </div>
  );
};

export default ManageBookings;
