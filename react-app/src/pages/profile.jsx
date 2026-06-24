import {
  useEffect,
  useState,
} from "react";

function Profile() {

  const [user,
    setUser] =
    useState(null);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    fetch(
      `${import.meta.env.VITE_API_URL}/me`,
      {
        headers: {
          Authorization:
            token,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setUser(data)
      );

  }, []);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="page">

      <h1>
        Profile
      </h1>

      <p>
        Name:
        {user.name}
      </p>

      <p>
        Email:
        {user.email}
      </p>

      <p>
        Role:
        {user.role}
      </p>

    </div>
  );
}

export default Profile;