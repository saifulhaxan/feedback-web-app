import React from "react";
import ERD from "../../assets/images/erd.png";
import ErdParent from "../../assets/images/erd-child.png";
import ErdChild from "../../assets/images/erd-parent.png";
import { MdOutlineCreate } from "react-icons/md";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  overflow: "auto",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 2,
};

export default function FeedbackErd() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="feedbackerd-wrapper mb-5">
        <img src={ERD} alt="" className="erd-img" />
        <div
          className="erd-parent-box d-flex align-items-center cursor-pointer"
          onClick={handleOpen}
        >
          <div className="erd-parent-text me-2">
            <p className="mb-0">Lorem Ipsum is...</p>
          </div>
          <div className="erd-parent-img">
            <img src={ErdParent} alt="" />
          </div>
        </div>

        <div
          className="erd-child-box d-flex align-items-center cursor-pointer"
          onClick={handleOpen}
        >
          <div className="erd-child-text me-2">
            <p className="mb-0">Lorem Ipsum is...</p>
          </div>
          <div className="erd-child-img">
            <img src={ErdChild} alt="" />
          </div>
        </div>

        <div
          className="erd-communication-box d-flex align-items-center px-2 py-1 cursor-pointer"
          onClick={handleOpen}
        >
          <div className="erd-communication-text me-2">
            <p className="mb-0">Communication or Application</p>
          </div>
          <div className="erd-communication-img">
            <MdOutlineCreate />
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4 className="mb-3">Comments</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages
          </p>
        </Box>
      </Modal>
    </>
  );
}
