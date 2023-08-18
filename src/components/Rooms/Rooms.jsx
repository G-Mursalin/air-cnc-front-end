import React, { useEffect, useState } from "react";
import Container from "../shared/Container/Container";
import Card from "./Card";
import Loader from "../shared/Loader/Loader";
import { useSearchParams } from "react-router-dom";
import Heading from "../Heading/Heading";
import axios from "axios";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const category = params.get("category");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/v1/rooms")
      .then((data) => {
        if (category) {
          const filterData = data.data.data.rooms.filter(
            (room) => room.category === category
          );
          setRooms(filterData);
        } else {
          setRooms(data.data.data.rooms);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [category]);

  //   Show Loading
  if (loading) return <Loader />;

  return (
    <Container>
      {rooms && rooms.length > 0 ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {rooms.map((val, i) => (
            <Card key={i} room={val} />
          ))}
        </div>
      ) : (
        <div className="min-h-[calc(100vh-264.8px)] flex items-center justify-center">
          <Heading
            title="No Rooms Available In This Category"
            subtitle="Please Select Others Categories"
            center={true}
          />
        </div>
      )}
    </Container>
  );
};

export default Rooms;
