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
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err.message));
};
