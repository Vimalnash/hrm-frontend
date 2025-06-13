import { useEffect, useRef, useState } from "react";
import { CustomModal } from "../components/Modals/labourCreationModal-Single";
import { PageTitle } from "../components/pagetitle";
import { useAppContext } from "../context/appcontext";
import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TeamList } from "../components/Modals/teamlist";
import { FaRegEdit } from "react-icons/fa";


export function AttendanceLayout({children}) {
  
  const {
    labour, setLabour, attendanceData, 
    setAttendanceData, 
    showNewEntry, setShowNewEntry,
    teamNamesArray,
    countsState, setCountsState
  } = useAppContext();

  const navigate = useNavigate();

  const [teamWiseLaboursList,setTeamWiseLaboursList] = useState();
  const [saveSuccess,setSaveSuccess] = useState(false);
  const [saveFailure,setSaveFailure] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeScreenBtn, setActiveScreenBtn] = useState(false);

  const [attendaceDate, setAttendanceDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  })
  const[project, setProject] = useState();
  const team = useRef();
  // console.log("date&project", date, project, attendanceData);

  // Setting attendance data from the backend if present(i.e BrowserLocal Storage)
  useEffect(()=> {
    const localCache = JSON.parse(localStorage.getItem("attendanceDetails"))
    // console.log(localCache);
    if(!localCache) { 
      setAttendanceData([]);
    } else setAttendanceData(localCache)
  }, [])

  // Setting Local state TeamwiseLabourArray based on changes in global state.
  useEffect(() => {
    setTeamWiseLaboursList(labour);
  },[labour])

  // console.log("teamwiselabourlist",teamWiseLaboursList);
  // Filtering TeamwiseLabourData to load existing data on screen based on selected Date and Project 
  useEffect(()=>{
    attendanceData.some((objVal, idx) => {
      // console.log("useeffectdate", attendaceDate, project)
      if(objVal.date === attendaceDate && objVal.project === project) {
        alert("Data Available for this Date and project");
        setLabour(objVal.teamDetails);
        setShowNewEntry(false);
        const presentabsentshiftCount =  objVal.teamDetails.reduce((acc, teamObj) => {
          let atWorkcount = 0;
          let absentcount = 0;
          let shiftcount = 0;
          for (let i=0; i<teamObj.labours.length; i++) {
            if (teamObj.labours[i].status? teamObj.labours[i].status == "P" : false) {
              atWorkcount = atWorkcount + 1;
            }
            if (teamObj.labours[i].status? teamObj.labours[i].status == "A" : false) {
              absentcount = absentcount + 1;
            }
            if (teamObj.labours[i].shift? (teamObj.labours[i].shift != "" || teamObj.labours[i].shift != null) : false) {
              shiftcount += 1;
            }
          }
          acc.presentCount += atWorkcount;
          acc.absentCount += absentcount;
          acc.shiftAssignedCount += shiftcount;
          return acc
        },{ presentCount: 0, absentCount: 0, shiftAssignedCount: 0})
        setCountsState({...countsState, ...presentabsentshiftCount })
        return true
      }
      else {
        setCountsState({...countsState, presentCount: 0, absentCount: 0, shishiftAssignedCountftAssigned: 0})
      }
    })
  },[attendaceDate, project])

  // Team Selected from MultileSelect for attendance marking
  function setSelectedTeam(e) {
    const selectedTeamLaboursList = labour.filter((val) => e.target.value == "All" ? true :  val.teamName == e.target.value)
    setTeamWiseLaboursList(selectedTeamLaboursList);
  }
  
  // Modal Open and Close Functions
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Show Next Date from current selected Date
  function addaDayToDate(date) {
    // console.log(date)
    const nextDate = new Date(date);
    // console.log(nextDate)
    nextDate.setDate(nextDate.getDate() + 1);
    setAttendanceDate(nextDate.toISOString().split('T')[0]);
  }

  // Show Previous Date from the current selected date
  function subtractaDayToDate(date) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() - 1);
    setAttendanceDate(nextDate.toISOString().split('T')[0]);
  }

  return (
    <div className="p-2 border-2 text-center">
      <div className="my-4 flex flex-col gap-4 md:flex-row md:gap-8 justify-center items-end">
        <div className="flex flex-col gap-2">
          <label>Project</label>
          <select className="w-48 shadow-md select select-sm" onChange={(e)=>setProject(e.target.value)}>
            <option value={""}>select</option>
            <option value={"project1"}>Project1</option>
            <option value={"project2"}>Project2</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label>Team</label>
          <select ref={team} className="w-48 shadow-md select select-sm" onChange={(e)=>setSelectedTeam(e)}>
            <option value={"All"}>All</option>
            {
              teamNamesArray.map((teamName) => {
                return <option key={teamName} value={teamName}>{teamName}</option>
              })
            }
          </select>
        </div>

        <div>
          <button 
            className="btn btn-sm bg-blue-400 text-white text-lg" 
            onClick={openModal}
          ><FaRegEdit /></button>
          <TeamList
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Select Team"
            content=""
            teamNamesArray = {teamNamesArray}
            setTeamWiseLaboursList = {setTeamWiseLaboursList}
          />
        </div>
      </div>

      <div className="my-4 flex justify-center gap-4 ">
        <button 
          className={`btn btn-sm bg-gray-500 text-white ${activeScreenBtn? "border-y-2 border-organge-400" : ""}` }
          onClick={()=> {
            subtractaDayToDate(attendaceDate);
            setActiveScreenBtn(true)}}
        >&lt;</button>
        <input 
          className="input" 
          type="date" 
          name="date" 
          value={attendaceDate} 
          onChange={(e)=>setAttendanceDate(e.target.value)} 
        />
        <button 
          className="btn btn-sm bg-gray-500 text-white"
          onClick={()=> addaDayToDate(attendaceDate)}
        >&gt;</button>
      </div>

      <div className="w-full p-4 bg-blue-50 flex flex-wrap justify-around">
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">
          Labours &#40;{countsState.laboursCount}&#41;
        </button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">
          At Works &#40;{countsState.presentCount}&#41;
        </button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">
          Shift &#40;{countsState.shiftAssignedCount}&#41;
        </button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">
          Absent &#40;{countsState.absentCount}&#41;
        </button>
      </div>

      <div className="w-full p-4 flex flex-wrap gap-2 justify-center items-center">
        <button 
          className={`btn btn-xs bg-gray-100  ${activeScreenBtn ? "border-gray-400":""}`}
          onClick={() => navigate("/labourattendance")}
          >Pending &#40;{countsState.laboursCount}&#41;
        </button>
        <button 
          className="btn btn-xs bg-gray-100 border-gray-400" 
          onClick={() => {navigate("/shiftassign"); 
          handleShiftAssign(); } }
        >AtWork &#40;{countsState.presentCount}&#41;</button>
        <button 
          className="btn btn-xs bg-gray-100 border-gray-400" 
          onClick={() => {navigate("/report/labourattendance"); 
          handleReport();}}
        >Marked</button>
      </div>

    </div>
  )
}