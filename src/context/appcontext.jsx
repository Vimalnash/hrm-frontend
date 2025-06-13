import { createContext, useContext, useEffect, useState } from "react"

// Creating Context for State Management
const AppCtx = createContext(null);

// Main Context
export default function AppContext({children}) {
  const [showNewEntry, setShowNewEntry] = useState(true);
  const [team, setTeam] = useState([]);
  const [labour, setLabour] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [teamNamesArray, setTeamNamesArray] = useState([]);
  const [countsState, setCountsState] = useState(() => 
    {return {
    laboursCount: 0,
    presentCount: 0,
    absentCount: 0,
    shiftAssignedCount: 0
  }});

  // Setting TeamWiseLabourArrayList and TeamNamesonly Array
  useEffect(()=>{
    fetch("../labourlist.json", {method: "GET"})
    .then((res) => res.json())
    .then((data) => {
      setLabour(data.labourlist);

      // Setting TeamNames Only Array
      const teamList = data.labourlist.map((val) => {
        return val.teamName
      })
      setTeamNamesArray(teamList);

      // Setting Total Labous Count
      const labourCount = data.labourlist.reduce((acc, teamObj) => {
        console.log(teamObj)
        acc = acc + teamObj.labours.length;
        return acc
      },0)
      setCountsState({...countsState, laboursCount: labourCount })
    })
    .catch((error) => console.log(error))
  },[])

  return (
    <AppCtx.Provider value={{
      showNewEntry, setShowNewEntry,
      team, labour, setLabour,
      attendanceData, setAttendanceData,
      teamNamesArray, setTeamNamesArray,
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