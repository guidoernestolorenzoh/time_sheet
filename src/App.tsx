import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import TimeSheetPage from "@/pages/timeSheet";
/* import PricingPage from "@/pages/pricing"; */
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/login";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<TimeSheetPage />} path="/time-sheet" />
      {/* <Route element={<PricingPage />} path="/pricing" /> */}
      <Route element={<SettingsPage />} path="/settings" />
      <Route element={<LoginPage />} path="/login" />
    </Routes>
  );
}

export default App;
