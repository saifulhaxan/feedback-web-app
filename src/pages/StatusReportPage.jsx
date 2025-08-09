import React from "react";
import ProblemImg from "../assets/images/problem.png";
import SolutionImg from "../assets/images/solution.png";

export default function StatusReportPage() {
  return (
    <section className="main_wrapper">
      <div className="container-fluid ps-5 pe-5">
        <div className="row">
          <div className="col-lg-12">
            <div className="heading_wrapper d-flex align-items-center justify-content-between mt-4 mb-4">
              <h1>Status Report</h1>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-lg-6">
            <div className="report-heading text-center">
              <h6>Before</h6>
              <div className="reportCard reportCardBefore">
                <h2 className="pt-4 pb-3">Problem</h2>
                <h2 className="reportProblem reportProblemBefore mb-4">
                  <span>Dirty Floor</span>
                </h2>
                <div className="reportImage">
                  <img src={ProblemImg} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="report-heading text-center">
              <h6>After</h6>
              <div className="reportCard reportCardAfter">
                <h2 className="pt-4 pb-3">Solution</h2>
                <h2 className="reportProblem reportProblemAfter mb-4">
                  <span>Clean Floor</span>
                </h2>
                <div className="reportImage">
                  <img src={SolutionImg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4 pb-5">
          <div className="col-lg-12">
            <div className="status-overall-heading text-center">
              <h3 className="text-success">Solution Function</h3>
              <div>
                <p className="mb-1 report-para">
                  Project Status:{" "}
                  <span className="text-primary report-span">
                    100% Completed
                  </span>
                </p>
                <p className="mb-1 report-para">
                  Start Date:{" "}
                  <span className="report-span">01/10/2024, 5PM</span>
                </p>
                <p className="mb-1 report-para">
                  End Date: <span className="report-span">01/10/2024, 5PM</span>
                </p>
                <p className="mb-1 report-para">
                  Duration: <span className="report-span">5 days, 3 hours</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
