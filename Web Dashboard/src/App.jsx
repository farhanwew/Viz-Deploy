import { useState } from "react";
import LandingPageITS from "./components/LandingPageITS";
import PopulationDashboard from "./components/PopulationDashboard";
import CompetencyDashboard from "./components/CompetencyDashboard";

function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("activeDashboard") || "landing";
  });

  const handleSetPage = (newPage) => {
    setPage(newPage);
    localStorage.setItem("activeDashboard", newPage);
  };

  return (
    <>
      {page === "landing" && (
        <LandingPageITS onEnterDashboard={(pageName) => handleSetPage(pageName)} />
      )}

      {page === "population" && (
        <PopulationDashboard onBack={() => handleSetPage("landing")} />
      )}

      {page === "competency" && (
        <CompetencyDashboard onBack={() => handleSetPage("landing")} />
      )}
    </>
  );
}

export default App;
