import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast";
import TableRow from "../../components/Dashboard/TableRow";
import DeleteModal from "../../components/Modal/DeleteModal";
import NoDataFound from "../../components/shared/NavBar/NoDataFound";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loader from "../../components/shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [axiosSecure] = useAxiosSecure();
  const [error, setError] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookings", user?.email],
    queryFn: async () => {
      try {
        const data = await axiosSecure.get(`/bookings?email=${user.email}`);

        return data.data.data.bookings;
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

  // Handle Modal
  const modalHandler = () => {
    // Delete the selected booking information from database
    axiosSecure
      .delete(`/bookings/${selectedData._id}`)
      .then((data) => {
        toast.success(data.data.message);
        refetch();
        // Update deleted booking room booked status
        axiosSecure
          .patch(`/rooms/status/${selectedData.roomId}`, { status: false })
          .then((data) => {
            toast.success(data.data.message);
          })
          .catch((err) => {
            // Catch Errors for Update the Room Booked Status
            const errorData = err.response.data;
            if (errorData.status === "fail") {
              toast.error(errorData.message);
            } else if (errorData.status === "error") {
              toast.error(errorData.message);
            } else {
              toast.error(err.message);
            }
          });
      })
      .catch((err) => {
        // Catch Errors for Delete the selected booking information from database
        const errorData = err.response.data;
        if (errorData.status === "fail") {
          toast.error(errorData.message);
        } else if (errorData.status === "error") {
          toast.error(errorData.message);
        } else {
          toast.error(err.message);
        }
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
  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
    return (
      <NoDataFound
        message="You Did Not Booked Room Yet"
        address="/"
        label="Browse Rooms"
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

export default MyBookings;
