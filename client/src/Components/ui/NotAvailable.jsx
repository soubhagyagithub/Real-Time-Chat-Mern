import React from "react";

const NotAvailable = ({ display }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {display}
      </div>
    </>
  );
};

export default NotAvailable;
