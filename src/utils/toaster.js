import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
import toasterSuccessIcon from "./../assests/icons/ic-toaster-success.svg";
import toasterAlertIcon from "./../assests/icons/ic-toaster-alert.svg";
import toasterCloseIcon from "./../assests/icons/ic-toaster-close.svg";

const toaster = (type, message, timer = 5000) => {
  // type - "success"|"error"
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    showCloseButton: true,
    closeButtonHtml: `<img src="${toasterCloseIcon}" alt="success"/>`,
    customClass: {
      popup: `theme-toaster-popup ${type === "success" ? "success" : "alert"}`,
      htmlContainer: "theme-toaster-container",
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    html: `
    <div className="d-flex align-items-center flex-1">
      <span className="icon"><img src="${
        type === "success" ? toasterSuccessIcon : toasterAlertIcon
      }" alt=""/></span>
      <span className="text flex-1">${message}</span>        
    </div>`,
  });
};

export default toaster;
