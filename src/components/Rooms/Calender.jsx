import { DateRange } from "react-date-range";

const Calender = ({ value, handleSelect }) => {
  return (
    <DateRange
      rangeColors={["#F43F5E"]}
      ranges={[value]}
      onChange={handleSelect}
      direction="vertical"
      showDateDisplay={false}
      minDate={value.startDate}
      maxDate={value.endDate}
    />
  );
};

export default Calender;
