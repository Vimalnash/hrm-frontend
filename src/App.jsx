import React from "react";
import { Route, Routes } from "react-router-dom"
import { Sidebar } from "./components/sidebar"
import { HomePage } from "./pages/HomePage";
import { LabourAttendance } from "./pages/LabourAttendance";

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
        </Routes>
      </main>
    </div>
    </>
  )
}

export default App


