import React from "react";
import SolutionTimer from "../components/SolutionTimer/SolutionTimer";

export default function SolutionFunctionPage() {
  return (
    <section>
      <div className="mt-5">
        <h3 className="text-center fw-bold">Michael David Function Status</h3>
      </div>

      <div>
        <SolutionTimer />
      </div>
    </section>
  );
}
