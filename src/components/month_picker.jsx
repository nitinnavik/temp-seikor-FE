import React from "react";

function MonthPicker(props) {
  return (
    <select
      value={props?.value}
      name={props?.name}
      className={`${props?.className} bg-white form-control outline-none  p-2 color-primary fs-12 down-arrow-logo `}
      onChange={(e) => {
        props?.onChange(e);
      }}
      disabled={props?.disabled}
      style={{ height: "39px" }}
    >
      <option value="Jan">Jan</option>
      <option value="Feb">Feb</option>
      <option value="Mar">Mar</option>
      <option value="Apr">Apr</option>
      <option value="May">May</option>
      <option value="Jun">Jun</option>
      <option value="Jul">Jul</option>
      <option value="Aug">Aug</option>
      <option value="Sep">Sep</option>
      <option value="Oct">Oct</option>
      <option value="Nov">Nov</option>
      <option value="Dec">Dec</option>
    </select>
  );
}

export const monthValue = (monthName) => {
  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let index = monthList.indexOf(monthName);
  return index + 1;
};

export default MonthPicker;
