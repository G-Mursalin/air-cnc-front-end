import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { deleteRoom, getAllRoom } from "../../api/rooms";
import { toast } from "react-hot-toast";
import RoomDataRow from "../../components/Dashboard/RoomDataRow";
import DeleteModal from "../../components/Modal/DeleteModal";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const { user } = useContext(AuthContext);
  const [refetchListings, setRefetchListings] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const deleteModalHandler = () => {
    deleteRoom(selectedData._id)
      .then((data) => {
        if (data.status === "fail") {
          toast.error(data.message);
        } else {
          toast.success(data.status);
          setRefetchListings((pre) => !pre);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });

    // Closed The Model
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
    getAllRoom(user.email)
      .then((data) => {
        if (data.status === "fail") {
          toast.error(data.message);
        } else {
          toast.success(data.status);
          setListings(data.data.rooms);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [user, refetchListings]);

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
                    Booking
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    Delete
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
                  >
                    Update
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings.map((room) => (
                  <RoomDataRow
                    setSelectedData={setSelectedData}
                    room={room}
                    key={room._id}
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
          modalHandler={deleteModalHandler}
          isOpen={isOpen}
          closeModal={closeModal}
          id={selectedData._id}
        />
      )}
    </div>
  );
};

export default MyListings;
