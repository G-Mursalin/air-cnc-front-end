import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { TbFidgetSpinner } from "react-icons/tb";
import { categories } from "../Categories/categoriesData";
import { imageUpload } from "../../api/utils";
const UpdateRoomForm = ({
  handleSubmit,
  roomData,
  closeModal,
  setRoomData,
}) => {
  const { from, to } = roomData;

  const [dates, setDates] = useState({
    startDate: new Date(from),
    endDate: new Date(to),
    key: "selection",
  });
  const [selectedImageName, setSelectedImageName] = useState("Upload Image");

  //   React Date Range
  const handleDates = (ranges) => {
    setDates({ ...ranges.selection });

    setRoomData({
      ...roomData,
      from: ranges.selection.startDate,
      to: ranges.selection.endDate,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-10">
          <div className="space-y-1 text-sm">
            <label htmlFor="location" className="block text-gray-600">
              Location
            </label>
            <input
              className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
              name="location"
              value={roomData?.location}
              onChange={(event) =>
                setRoomData({ ...roomData, location: event.target.value })
              }
              id="location"
              type="text"
              placeholder="Location"
              required
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="title" className="block text-gray-600">
              Title
            </label>
            <input
              value={roomData?.title}
              onChange={(event) =>
                setRoomData({ ...roomData, title: event.target.value })
              }
              className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
              name="title"
              id="title"
              type="text"
              placeholder="Title"
              required
            />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="category" className="block text-gray-600">
              Category
            </label>
            <select
              onChange={(event) =>
                setRoomData({ ...roomData, category: event.target.value })
              }
              required
              defaultValue={roomData.category}
              className="w-full px-4 py-3 border-rose-300 focus:outline-rose-500 rounded-md"
              name="category"
            >
              {categories.map((category) => (
                <option value={category.label} key={category.label}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calender */}
          <div className="space-y-1">
            <label htmlFor="location" className="block text-gray-600">
              Select Availability Range
            </label>
            <div className="flex justify-center pt-2">
              <DateRange
                onChange={handleDates}
                ranges={[dates]}
                rangeColors={["#F43F5E"]}
              />
            </div>
          </div>

          {/* Image */}
          <div className=" p-4 bg-white w-full  m-auto rounded-lg">
            <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
              <div className="flex flex-col w-max mx-auto text-center">
                <label>
                  <input
                    onChange={(event) => {
                      setSelectedImageName(event.target.files[0].name);
                      imageUpload(event.target.files[0])
                        .then((data) => {
                          setRoomData({
                            ...roomData,
                            image: data.data.display_url,
                          });
                        })
                        .catch((err) => {
                          toast.error(err.message);
                        });
                    }}
                    className="text-sm cursor-pointer w-36 hidden"
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    hidden
                  />
                  <div className="bg-rose-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-rose-500">
                    {selectedImageName}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="space-y-1 text-sm">
              <label htmlFor="price" className="block text-gray-600">
                Price
              </label>
              <input
                value={roomData?.price}
                onChange={(event) =>
                  setRoomData({ ...roomData, price: event.target.value })
                }
                className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                name="price"
                id="price"
                type="number"
                placeholder="Price"
                required
              />
            </div>

            <div className="space-y-1 text-sm">
              <label htmlFor="guest" className="block text-gray-600">
                Total guest
              </label>
              <input
                value={roomData?.guests}
                onChange={(event) =>
                  setRoomData({ ...roomData, guests: event.target.value })
                }
                className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                name="total_guest"
                id="guest"
                type="number"
                placeholder="Total guest"
                required
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="space-y-1 text-sm">
              <label htmlFor="bedrooms" className="block text-gray-600">
                Bedrooms
              </label>
              <input
                value={roomData?.bedrooms}
                onChange={(event) =>
                  setRoomData({ ...roomData, bedrooms: event.target.value })
                }
                className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                name="bedrooms"
                id="bedrooms"
                type="number"
                placeholder="Bedrooms"
                required
              />
            </div>

            <div className="space-y-1 text-sm">
              <label htmlFor="bathrooms" className="block text-gray-600">
                Bathrooms
              </label>
              <input
                value={roomData?.bathrooms}
                onChange={(event) =>
                  setRoomData({ ...roomData, bathrooms: event.target.value })
                }
                className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                name="bathrooms"
                id="bathrooms"
                type="number"
                placeholder="Bathrooms"
                required
              />
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="description" className="block text-gray-600">
              Description
            </label>

            <textarea
              value={roomData?.description}
              onChange={(event) =>
                setRoomData({ ...roomData, description: event.target.value })
              }
              id="description"
              className="block rounded-md focus:rose-300 w-full h-32 px-4 py-3 text-gray-800  border border-rose-300 focus:outline-rose-500 "
              name="description"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-rose-500"
        >
          {false ? (
            <TbFidgetSpinner className="m-auto animate-spin" size={24} />
          ) : (
            "Update"
          )}
        </button>
        <button
          onClick={closeModal}
          className="w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-rose-500"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateRoomForm;
