import { Route, Routes } from "react-router-dom"
import { Sidebar } from "./components/sidebar"
import { LabourAttendance } from "./pages/LabourAttendance"
import { WelcomePage } from "./pages/WelcomePage"

function App() {

  return (
    <>
    <div className="flex">
      <aside>
        <Sidebar />
      </aside>
      <main className="p-5 w-full">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/labourattendance" element={<LabourAttendance />} />
        </Routes>
      </main>
    </div>
    </>
  )
}

export default App


