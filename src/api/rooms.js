// Send Room Information to Database
export const saveRoom = async (roomData) => {
  const response = await fetch("http://localhost:5000/api/v1/rooms", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(roomData),
  });

  const data = await response.json();
  return data;
};

// Get All Rooms from Database
export const getAllRoom = async () => {
  const response = await fetch("http://localhost:5000/api/v1/rooms", {
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

// Get A Single Rooms from Database
export const getARoom = async (id) => {
  const response = await fetch(`http://localhost:5000/api/v1/rooms/${id}`, {
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

// Update Room Booked status
export const updateRoomBookedStatus = async (id, status) => {
  const response = await fetch(
    `http://localhost:5000/api/v1/rooms/status/${id}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();
  return data;
};
