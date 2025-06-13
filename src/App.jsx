import React from "react";
import { Route, Routes } from "react-router-dom"
import { Sidebar } from "./components/sidebar"
import { HomePage } from "./pages/HomePage";
import { LabourAttendance } from "./pages/labour-attendance"
import { LabourShiftAssign } from "./pages/labour-shiftassign";
import { LabourAttendanceReport } from "./pages/labour-attendance-report";

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


