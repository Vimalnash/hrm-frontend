import { createContext, useContext, useEffect, useState } from "react"

const AppCtx = createContext(null)

export function useAppContext() {
  return useContext(AppCtx)
}

export default function AppContext({children}) {
  const [showNewEntry, setShowNewEntry] = useState(true);
  const [team, setTeam] = useState([]);
  const [labour, setLabour] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(()=>{
    fetch("../labourlist.json", {method: "GET"})
    .then((res) => res.json())
    .then((data) => {
      // console.log("labour data", data.labourlist)
      // data.labourlist.map((val, idx) => {
      //   const newLabourList = [];
      //   const cache = {};
      //   if (cache[val.teamName] )
      // })
      setLabour(data.labourlist)

      })
    .catch((error) => console.log(error))

  },[])

  return (
    <AppCtx.Provider value={{
      showNewEntry, setShowNewEntry,
      team, labour, setLabour,
      attendanceData, setAttendanceData
    }}>
      {children}
    </AppCtx.Provider>
  )
}

