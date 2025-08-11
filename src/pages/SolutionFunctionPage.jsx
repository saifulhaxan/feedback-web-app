import React from "react";
import SolutionTimer from "../components/SolutionTimer/SolutionTimer";
import { useLocation } from "react-router-dom";

export default function SolutionFunctionPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectId = params.get("projectId");

  return (
    <section>
      <div className="mt-5">
        <h3 className="text-center fw-bold">Michael David Function Status</h3>
      </div>

      <div>
        <SolutionTimer projectId={projectId} />
      </div>
    </section>
  );
}
