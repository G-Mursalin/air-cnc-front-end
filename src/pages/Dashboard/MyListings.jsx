import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import RoomDataRow from "../../components/Dashboard/RoomDataRow";
import DeleteModal from "../../components/Modal/DeleteModal";
import NoDataFound from "../../components/shared/NavBar/NoDataFound";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/shared/Loader/Loader";

const MyListings = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [axiosSecure] = useAxiosSecure();

  const {
    data: listings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-listings", user?.email],
    queryFn: async () => {
      try {
        const data = await axiosSecure.get(
          `/rooms/my-listings?email=${user.email}`
        );

        return data.data.data.rooms;
      } catch (error) {
        const { data } = error.response;
        if (data.status === "fail") {
          toast.error(data.message);
          setError({ errorMessage: data.message });
          return [];
        } else if (data.status === "error") {
          toast.error(data.message);
          setError({ errorMessage: data.message });
          return [];
        } else {
          toast.error(error.message);
          setError({ errorMessage: error.message });
          return [];
        }
      }
    },
  });

  if (isLoading) return <Loader />;

  const deleteModalHandler = () => {
    // Delete Room
    axiosSecure
      .delete(`/rooms/${selectedData._id}`)
      .then((data) => {
        toast.success(data.data.message);
        refetch();
      })
      .catch((err) => {
        // Catch Errors for Delete Room
        const errorData = err.response.data;
        if (errorData.status === "fail") {
          toast.error(errorData.message);
        } else if (errorData.status === "error") {
          toast.error(errorData.message);
        } else {
          toast.error(err.message);
        }
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

  // If no data found then show the user message
  if (!listings || !Array.isArray(listings) || listings.length === 0) {
    return (
      <NoDataFound
        message="No Room Data Available!"
        address="/dashboard/add-room"
        label="Add Room"
      />
    );
  }

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
