import React, { useState } from "react";

const SwitchButton = ({ data, value, setValue, theme, onSwitch }) => {
  // const [optionOneSelected, setOptionOneSelected] = useState(
  //   value === data[0] ? true : false
  // );
  // const [optionTwoSelected, setOptionTwoSelected] = useState(
  //   value !== data[0] ? true : false
  // );

  const onSwitchClick = (name) => {
    // if (name === data[0]) {
    //   setOptionOneSelected(true);
    //   setOptionTwoSelected(false);
    // } else {
    //   setOptionOneSelected(false);
    //   setOptionTwoSelected(true);
    // }
    if (onSwitch) {
      onSwitch(name);
    }

    if (setValue) {
      setValue(name);
    }
  };
  return (
    <React.Fragment>
      {data && data.length === 2 ? (
        <div
          className={`switch-widget d-inline-block ${
            theme && theme === "black" ? "black" : ""
          }`}
        >
          <button
            className={`option d-inline-block ${
              value === data[0] ? "active" : ""
            }`}
            onClick={() => {
              onSwitchClick(data[0]);
            }}
          >
            {data[0]}
          </button>
          <button
            className={`option d-inline-block ${
              value === data[1] ? "active" : ""
            }`}
            onClick={() => {
              onSwitchClick(data[1]);
            }}
          >
            {data[1]}
          </button>
        </div>
      ) : (
        "Switcher accept two values"
      )}
    </React.Fragment>
  );
};
export default SwitchButton;
