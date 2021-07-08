import React from "react";

const Notification = ({ message }) => {
  // console.log(message)
  if (message === null) {
    return null;
  }

  return (
    <div id="notification" className={message.state}>
      {message.message}
    </div>
  );
};

export default Notification;
