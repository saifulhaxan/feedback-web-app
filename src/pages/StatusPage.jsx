import { Button } from "@mui/material";
import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import StatusCard from "../components/statusCard/StatusCard";

function StatusPage() {
  const [gridView, setGridView] = useState(true);
  const [listView, setListView] = useState(false);

  const statusArr = [
    {
      title: "Floor Cleaning",
      problemExistedBefore: "Dirty Floor",
      solutionReplaceAfter: "Clean Floor",
      solutionFunction: "Mop Floor",
      projectStatus: "100% Completed",
    },
    {
      title: "Car Repair",
      problemExistedBefore: "Dirty Floor",
      solutionReplaceAfter: "Clean Floor",
      solutionFunction: "Mop Floor",
      projectStatus: "100% Completed",
    },
    {
      title: "Floor Cleaning",
      problemExistedBefore: "Dirty Floor",
      solutionReplaceAfter: "Clean Floor",
      solutionFunction: "Mop Floor",
      projectStatus: "100% Completed",
    },
    {
      title: "Car Repair",
      problemExistedBefore: "Dirty Floor",
      solutionReplaceAfter: "Clean Floor",
      solutionFunction: "Mop Floor",
      projectStatus: "100% Completed",
    },
  ];

  const changeToGrid = () => {
    setGridView(true);
    setListView(false);
  };

  const changeToList = () => {
    setGridView(false);
    setListView(true);
  };
  return (
    <section className="main_wrapper">
      <div className="container-fluid ps-5 pe-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <h1>Status</h1>
              <div className="viewbtns">
                <Button
                  className={`viewBtn1 ${listView ? "viewActiveBtn" : ""}`}
                  onClick={changeToList}
                >
                  <FaList
                    className={`viewBtn1 ${
                      listView ? "listViewActive" : "listView"
                    }`}
                  />
                </Button>
                <Button
                  className={`viewBtn2 ${gridView ? "viewActiveBtn" : ""}`}
                  onClick={changeToGrid}
                >
                  <FiGrid
                    className={`viewBtn1 ${
                      gridView ? "listViewActive" : "listView"
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {statusArr.map((item, index) => {
            return (
              <div className={gridView ? "col-lg-3" : "col-lg-12"} key={index}>
                <StatusCard item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatusPage;
