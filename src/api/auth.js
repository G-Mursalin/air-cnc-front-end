// Send User to Database
export const saveUser = (user) => {
  const currentUser = {
    email: user.email,
  };

  fetch("http://localhost:5000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentUser),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {})
    .catch((err) => console.log(err.message));
};

// Make a User Role Host
export const makeAUserHost = (email) => {
  return fetch(`http://localhost:5000/api/v1/users/${email}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Check The User Role
export const isHost = async (email) => {
  const res = await fetch(`http://localhost:5000/api/v1/users/host/${email}`);

  const data = await res.json();

  return data?.isHost;
};
