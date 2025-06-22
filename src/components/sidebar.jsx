import { Link } from "react-router-dom";

// Main SideBar
export function Sidebar() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button lg:hidden">=</label>
        {/* Page content here */}
        
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full p-4">
          {/* Sidebar content here */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/labourattendance">LabourAttendance</Link></li>
        </ul>
      </div>
    </div>
  )
}