import { createContext, useContext, useEffect, useState } from "react"

// Creating Context for State Management
const AppCtx = createContext(null);

// Main Context
export default function AppContext({children}) {
  const [showNewEntry, setShowNewEntry] = useState(true);
  const [teams, setTeams] = useState([]);
  const [labours, setLabours ] = useState([]);
  const [attendanceDb, setAttendanceDb] = useState([]);
  const [countsState, setCountsState] = useState(() => 
    {return {
    laboursCount: 0,
    presentCount: 0,
    absentCount: 0,
    pendingAttCount: 0,
    shiftAssignedCount: 0,
    pendingShiftCount: 0,
    markedCount: 0,
    presentshiftcount: 0,
    projectAbsentCount: 0
  }});

  // Setting TeamWiseLabourArrayList and TeamNamesonly Array
  useEffect(()=>{
    fetch("../labourlist.json", {method: "GET"})
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      sessionStorage.setItem("dbTeamLabourList",  JSON.stringify(data));
      // Setting Total Labours Count
      let labourCount = data.labours.length;
      setCountsState((prev) => ({...prev, laboursCount: labourCount }))
    })
    .catch((error) => console.log(error))
  },[])

  return (
    <AppCtx.Provider value={{
      showNewEntry, setShowNewEntry,
      labours, setLabours,
      attendanceDb, setAttendanceDb,
      teams, setTeams,
      countsState, setCountsState
    }}>
      {children}
    </AppCtx.Provider>
  )
}

// funciton to utiize the useContenxt for easy access
export function useAppContext() {
  return useContext(AppCtx)
}