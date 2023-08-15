// Send Booking Information to Database
export const saveBooking = async (bookingData) => {
  const response = await fetch("http://localhost:5000/api/v1/bookings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();
  return data;
};

// Get All Bookings For Guest
export const getBookingsForGuest = async (email) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/bookings?email=${email}`
  );

  const data = await response.json();
  return data;
};

// Delete Booking Information
export const deleteBooking = async (id) => {
  const response = await fetch(`http://localhost:5000/api/v1/bookings/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

// Get All Bookings For Host
export const getBookingsForHost = async (email) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/bookings/host?email=${email}`
  );

  const data = await response.json();
  return data;
};
