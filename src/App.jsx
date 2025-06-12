import React from "react";
import { Route, Routes } from "react-router-dom"
import { Sidebar } from "./components/sidebar"
import { LabourAttendance } from "./pages/labour-attendance"
import { LabourAttendanceReport } from "./pages/labour-attendance-report";
import { HomePage } from "./pages/HomePage";
import { LabourShiftAssign } from "./pages/labour-shiftassign";

function App() {

  return (
    <>
    <div className="flex">
      <aside>
        <Sidebar />
      </aside>
      <main className="p-5 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/labourattendance" element={<LabourAttendance />} />
          <Route path="/report/labourattendance" element={<LabourAttendanceReport />} />
          <Route path="/shiftassign" element={<LabourShiftAssign />} />
        </Routes>
      </main>

    </div>
    </>
  )
}

export default App


