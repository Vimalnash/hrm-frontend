import { useEffect, useRef, useState } from "react";
import { PageTitle } from "../components/pagetitle";
import { useAppContext } from "../context/appcontext";
import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TeamList } from "../components/Modals/teamlist";
import { FaRegEdit } from "react-icons/fa";
import { AddLabourModalSingle } from "../components/Modals/AddLabourModalSingle";
import { AddLabourModalMultiple } from "../components/Modals/AddLabourModalMultiple";

export function LabourAttendanceReport() {
    const {
      labours, setLabours,
      teams, setTeams,
      attendanceDb, setAttendanceDb,
      showNewEntry, setShowNewEntry,
      teamNamesArray,
      countsState, setCountsState,
    } = useAppContext();
  
    const navigate = useNavigate();
  
    const [saveSuccess,setSaveSuccess] = useState(false);
    const [saveFailure,setSaveFailure] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeScreenBtn, setActiveScreenBtn] = useState(false);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [localLabours, setLocalLabours] = useState([]);
    const [labourAttendance, setLabourAttendance] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(() => {
      return new Date().toISOString().split('T')[0];
    })
    const[project, setProject] = useState("");
    const team = useRef();
  
    const [loadData, setLoadData] = useState(false);
    
    // Modal Open and Close Functions
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const [isModalOpenSingle, setModalOpenSingle] = useState(false);
    const [isModalOpenMultiple, setModalOpenMultiple] = useState(false);
  
    // Handling Modal Open and Close Modals
    const openModalSingle = () => setModalOpenSingle(true);
    const closeModalSingle = () => setModalOpenSingle(false);
    const openModalMultiple = () => setModalOpenMultiple(true);
    const closeModalMultiple = () => setModalOpenMultiple(false);
  
    // console.log("dbAttendance",dbAttendance)
    // console.log("labourAttendance",labourAttendance);
    // console.log("labours",labours);
    // console.log("loadData",loadData);
    // console.log("selectedTeams",selectedTeams);
  
    // Getting Global State from local DB as causing error in batch update the same array when used in AppContext setfunction. and when applying changes in one array it affects in another array variable
    useEffect(()=> {
      const dbTeamLabourListCache = JSON.parse(localStorage.getItem("dbTeamLabourList"))
      if (!dbTeamLabourListCache) {
        const baseLabourList = JSON.parse(sessionStorage.getItem("dbTeamLabourList"));
        localStorage.setItem("dbTeamLabourList", JSON.stringify(baseLabourList));
        // labours Array set
        setLabours(baseLabourList.labours);
        setLocalLabours(baseLabourList.labours);
        // TeamsArraySet
        setTeams(baseLabourList.teams);
        setSelectedTeams(baseLabourList.teams);
        setCountsState((prev) => ({...prev, laboursCount: baseLabourList.labours.length}));
      } else {
        // labours Array set
        setLabours(dbTeamLabourListCache.labours);
        setLocalLabours(dbTeamLabourListCache.labours);
        // TeamsArraySet
        setTeams(dbTeamLabourListCache.teams);
        setSelectedTeams(dbTeamLabourListCache.teams);
        setCountsState((prev) => ({...prev, laboursCount: dbTeamLabourListCache.labours.length}));
      }
  
      let attendanceDbCache = JSON.parse(localStorage.getItem("attendanceDb"))
  
      if (!attendanceDbCache) {
        localStorage.setItem("attendanceDb", JSON.stringify([]))
      }
    }, [])
  
      useEffect(()=> {
    }, [])
  
    // Filtering TeamwiseLabourData to load existing data on screen based on selected Date and Project 
    useEffect(()=>{
      const selectedDate = attendanceDate;
      const selectedProject = project;
      if(!selectedDate || !selectedProject) {
        alert("! Required fields  Date & Project");
        return;
      }

      setLoadData(false);
      setShowNewEntry(true);
      setCountsState((prev) => ({
        ...prev, 
        presentCount: 0, 
        absentCount: 0, 
        pendingAttCount: 0,
        shiftAssignedCount: 0,
        pendingShiftCount: 0,
        markedCount: 0,
        presentshiftcount: 0,
        projectAbsentCount: 0
      }))
    },[attendanceDate, project])
  
    // Setting Count for Pending to mark Attendance ehen labour list changes
    useEffect(() => {
      const dbTeamLabourListCache = JSON.parse(localStorage.getItem("dbTeamLabourList"))
      setSelectedTeams(teams);
      setCountsState((prev) => ({...prev, laboursCount: dbTeamLabourListCache.labours.length, markedCount: labours.length}))
    }, [labours])
  
    // Team Selected from MultileSelect for attendance marking
    function setSelectedTeam(e) {
      const selectedTeam = localLabours.filter((val) => e.target.value == "All" ? true :  val.teamName == e.target.value)
      setLabours(selectedTeam);
    }
  
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
  
    // Form Submmit handling
    const handleSubmit = (e) => {
      e.preventDefault();
      if(showNewEntry) {
        handleNewSave(e);
      } 
      else {
        handleUpdate(e);
      }
    }
  
    // Handling Pending Attendance Data Saving for the selected Date and Project
    const handleUpdate = (e) => {
      e.preventDefault();
      const selectedDate = attendanceDate;
      const selectedProject = project;
  
      if(!selectedDate || !selectedProject) {
        alert("! Required fields  Date, Project");
        return;
      }
  
      // Updating attendance Marked data in previous DB
      function newLabourAdd(labour) {
        const labourNewAttList = labourAttendance.filter(labourObj => {
          // console.log("labourobj", labourObj)
          return (labour.labourName === labourObj.labourName && labour.teamName === labourObj.teamName  && labour.project === labourObj.project && (labour.status === labourObj.status || labourObj.status === ""))
        })
  
        // console.log("newLabouradd", labourNewAttList);
        if(labourNewAttList.length < 1)
          return labour
        return labourNewAttList[0];
      }
  
      const attendanceDbCache = JSON.parse(localStorage.getItem("attendanceDb"));
      const updatedData = attendanceDbCache.map((labour) => {
        // console.log("InsideMappingupdatedData", labour);
        if(labour.attendanceDate === selectedDate && labour.project === selectedProject && labour.status === "P") {
          return newLabourAdd(labour)
        } else return labour
      });
      // console.log("updatedData",updatedData);
  
      let formAttendanceData = [...updatedData];
      // console.log("UpdateSaveformAttendanceData",formAttendanceData);
  
      localStorage.setItem("attendanceDb", JSON.stringify(formAttendanceData));
      setLabourAttendance([]);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        // location.reload();
      }, 1000);
    }
  
    // Handle Pending Button Click to Load the data for the selected date and Project
    function handleAttendancePending(e) {
      e.preventDefault();
      navigate("/labourattendance");
      const selectedDate = attendanceDate;
      const selectedProject = project;
      
      setLabourAttendance([]);

    
      if(!selectedDate || !selectedProject) {
        alert("! Required fields  Date & Project");
        return;
      }
    }

    // Handling AtWorkShiftAssignPending page Button Click
    function handleAtWorkPending(e) {
      e.preventDefault();
      navigate("/shiftassign");
      const selectedDate = attendanceDate;
      const selectedProject = project;
      
      setLabourAttendance([]);

    
      if(!selectedDate || !selectedProject) {
        alert("! Required fields  Date & Project");
        return;
      }
    }

    // Handling Marked page Button Click
    function handleMarked(e) {
      e.preventDefault();
      navigate("/report/labourattendance");
  
      const selectedDate = attendanceDate;
      const selectedProject = project;
      
      setLabourAttendance([]);
  
      if(!selectedDate || !selectedProject) {
        alert("! Required fields  Dateh & Project");
        return;
      }
      // console.log(selectedDate, selectedProject);
  
      let attendanceDbCache = JSON.parse(localStorage.getItem("attendanceDb"))
      
      if (!attendanceDbCache) {
        attendanceDbCache = [];
      }
  
      if(attendanceDbCache.length > 0) {
        let dataAvailable = false;

        attendanceDbCache.some((labour, idx) => {
          if(labour.attendanceDate === selectedDate) {
            dataAvailable = true;
            alert("Attendance Data Available for this Date");
            const filteredAttendanceDbCache = attendanceDbCache.filter((labour) => labour.attendanceDate === selectedDate);

            const pendingAttList = filteredAttendanceDbCache.filter((labour) => labour.status === "");

            const pendingShiftList = filteredAttendanceDbCache.filter((labour) => {
              return labour.project === selectedProject && labour.status === "P" && (labour.shift === "" || labour.shift === undefined);
            });

            const markedList = filteredAttendanceDbCache.filter((labour) => {
              return labour.project === selectedProject && (labour.status === "P" && (labour.shift !== "" ) || labour.status === "A")
            });

            setLabours(markedList);
            setLocalLabours(markedList);
            setShowNewEntry(false);
            let atWorkcount = 0;
            let absentcount = 0;
            let shiftcount = 0;
            let presentshiftcount = 0;
            let projectAbsentCount = 0;
            filteredAttendanceDbCache.forEach((labour) => {
                if (labour.status? labour.status == "P" : false) {
                  atWorkcount = atWorkcount + 1;
                }
                if (labour.status? labour.status == "A" : false) {
                  absentcount = absentcount + 1;
                }
                if (labour.shift? (labour.shift != "" || labour.shift != null) : false) {
                  shiftcount += 1;
                }
                if (labour.shift? (labour.status == "P" && (labour.shift != "" || labour.shift != null) && labour.project === selectedProject) : false) {
                  presentshiftcount += 1;
                }
                if (labour.status? (labour.status == "A" && labour.project === selectedProject) : false) {
                  projectAbsentCount += 1;
                }
            })

            setCountsState((prev) => ({
              ...prev, 
              presentCount: atWorkcount, 
              absentCount: absentcount, 
              shiftAssignedCount: shiftcount,
              pendingAttCount: pendingAttList.length,
              pendingShiftCount: pendingShiftList.length,
              markedCount: markedList.length,
              presentshiftcount,
              projectAbsentCount
            }))
            return true
          } 
        })

        if(!dataAvailable) {
          alert("!No Attendance Data Available in the DB")
          const dbTeamLabourListCache = JSON.parse(localStorage.getItem("dbTeamLabourList"))
          setLabours(dbTeamLabourListCache.labours);
          setLocalLabours(dbTeamLabourListCache.labours);
          setTeams(dbTeamLabourListCache.teams);
          setSelectedTeams(dbTeamLabourListCache.teams);
          setCountsState((prev) => ({
            ...prev, 
            presentCount: 0, 
            absentCount: 0, 
            shiftAssignedCount: 0,
            pendingAttCount: 0,
            pendingShiftCount: 0,
            markedCount: 0,
            presentshiftcount: 0,
            projectAbsentCount: 0
          }))
        }
      } 
      else {
        // alert("!No Attendance Data Available in the DB")
        const dbTeamLabourListCache = JSON.parse(localStorage.getItem("dbTeamLabourList"))
        setLabours(dbTeamLabourListCache.labours);
        setLocalLabours(dbTeamLabourListCache.labours);
        setTeams(dbTeamLabourListCache.teams);
        setSelectedTeams(dbTeamLabourListCache.teams);
        setCountsState((prev) => ({
          ...prev, 
          presentCount: 0, 
          absentCount: 0, 
          shiftAssignedCount: 0,
          pendingAttCount: 0,
          pendingShiftCount: 0,
          markedCount: 0,
          presentshiftcount: 0,
          projectAbsentCount: 0
        }))
      }
      setLoadData(true);
    }

    return (
      <>
      <PageTitle><p>Labour Attendance - ShiftAssign</p></PageTitle>
      
      <div className="mt-2 md:px-32 border-2 p-5" >
        <div className="my-4 flex flex-col gap-4 md:flex-row md:gap-8 justify-center items-end">
  
          <div className="flex flex-col gap-2">
            <label>Project</label>
            <select required className="w-48 shadow-md select select-sm" onChange={(e)=>setProject(e.target.value)}>
              <option></option>
              <option value={"project1"}>Project1</option>
              <option value={"project2"}>Project2</option>
            </select>
          </div>
  
          <div className="flex flex-col gap-2">
            <label>Team</label>
            <select ref={team} className="w-48 shadow-md select select-sm" onChange={(e)=>setSelectedTeam(e)}>
              <option value={"All"}>All</option>
              {
                teams.map((teamName, idx) => {
                  return <option key={`${teamName}-${idx}`} value={teamName}>{teamName}</option>
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
              setSelectedTeams = {setSelectedTeams}
              setLocalLabours = {setLocalLabours}
              localLabours = {localLabours}
            />
          </div>
        </div>
  
        <div className="my-4 flex justify-center gap-4 ">
          <button 
            className={`btn btn-sm bg-gray-500 text-white ${activeScreenBtn? "border-y-2 border-organge-400" : ""}` }
            onClick={()=> {
              subtractaDayToDate(attendanceDate);
              setActiveScreenBtn(true)}}
          >&lt;</button>
          <input 
            className="input" 
            type="date" 
            name="date" 
            value={attendanceDate} 
            onChange={(e)=>setAttendanceDate(e.target.value)} 
          />
          <button 
            className="btn btn-sm bg-gray-500 text-white"
            onClick={()=> addaDayToDate(attendanceDate)}
          >&gt;</button>
        </div>
  
      <div className="w-full p-4 bg-blue-50 flex flex-wrap justify-around gap-2">
        <div className="w-24 p-2 bg-blue-400 text-sm text-white rounded-md flex justify-center items-center">
          Labours &#40;{countsState.laboursCount}&#41;
        </div>
        <div className="w-24 p-2 bg-blue-400 text-sm text-white rounded-md flex justify-center items-center">
          At Works &#40;{countsState.presentCount}&#41;
        </div>
        <div className="w-24 p-2 bg-blue-400 text-sm text-white rounded-md flex justify-center items-center">
          Shift &#40;{countsState.shiftAssignedCount}&#41;
        </div>
        <div className="w-24 p-2 bg-blue-400 text-sm text-white rounded-md flex justify-center items-center">
          Absent &#40;{countsState.absentCount}&#41;
        </div>
      </div>
  
        <div className="w-full p-4 flex flex-wrap gap-2 justify-center items-center">
          <button 
            className={`btn btn-xs bg-gray-100  ${activeScreenBtn ? "border-gray-400":""}`}
            onClick={(e) => handleAttendancePending(e)}
            >Pending &#40;{countsState.pendingAttCount}&#41;
          </button>
          <button 
            className="btn btn-xs bg-gray-100 border-gray-400" 
            onClick={ (e) => handleAtWorkPending(e) }
          >AtWork &#40;{countsState.pendingShiftCount}&#41;</button>
          <button 
            className="btn btn-xs bg-gray-100 border-gray-400" 
            onClick={ (e) => handleMarked(e) }
          >Marked &#40;{countsState.markedCount}&#41;</button>
        </div>
  
        <div className="my-4">
          <p className="w-full h-8 bg-green-500 text-white flex items-center justify-center">
            Present + ShiftAssigned &#40;{countsState.presentshiftcount}&#41;
          </p>
          <ul className="">
            {loadData &&
              selectedTeams.map((team, idx) => {
                return (
                <li key={`${team}-${idx}`} className="p-2 border-b-2 border-blue-200">
                  <div className="mb-2 text-blue-400">
                    {team}
                  </div>
                  <ul>                  
                    {
                      labours && (
                        labours
                        .filter((labour, idx) => labour.teamName === team && labour.status === "P" && (labour.shift !== "" || labour.shift !== undefined))
                        .map((labour,idx, arr) => {
                          return (
                          <LabourList 
                          key={idx}
                          attendanceDate = {attendanceDate}
                          project = {project}
                          labour={labour} 
                          labourIdx={idx} 
                          labourAttendance={labourAttendance}
                          setLabourAttendance={setLabourAttendance}
                          localLabours = {localLabours}
                          setLocalLabours = {setLocalLabours}
                          />)
                        })
                      )
                    }
                  </ul>
                </li>
                ) 
              })
            }
          </ul>

          <p className="w-full h-8 bg-red-400 text-white flex items-center justify-center">
            Absent &#40;{countsState.projectAbsentCount}&#41;
          </p>
          <ul className="">
            {loadData &&
              selectedTeams.map((team, idx) => {
                return (
                <li key={`${team}-${idx}`} className="p-2 border-b-2 border-blue-200">
                  <div className="mb-2 text-blue-400">
                    {team}
                  </div>
                  <ul>                  
                    {
                      labours && (
                        labours
                        .filter((labour, idx) => labour.teamName === team && labour.status === "A" && (labour.shift === "" || labour.shift === undefined))
                        .map((labour,idx, arr) => {
                          return (
                          <LabourList 
                          key={idx}
                          attendanceDate = {attendanceDate}
                          project = {project}
                          labour={labour} 
                          labourIdx={idx} 
                          labourAttendance={labourAttendance}
                          setLabourAttendance={setLabourAttendance}
                          localLabours = {localLabours}
                          setLocalLabours = {setLocalLabours}
                          />)
                        })
                      )
                    }
                  </ul>
                </li>
                ) 
              })
            }
          </ul>
        </div>
  
        <div className="flex justify-center">
          {
            showNewEntry ?
            <button 
              type="submit" 
              className="btn btn-success" 
              onClick={(e) => handleSubmit(e)}
            >Save Attendance</button>
            :
            <button 
              type="submit" 
              className="btn btn-success" 
              onClick={(e) => handleSubmit(e)}
            >Update Attendance</button>
          }
        </div>
  
        <div>
          {saveSuccess? <p className="text-green-400">SavedSuccessfully</p> : "" }
          {saveFailure? <p className="text-red-400">Failed to Save</p> : "" }
        </div>
      </div>
      </>
    )
  }


function LabourList({attendanceDate, project, labour, labourIdx, labourAttendance, setLabourAttendance, localLabours, setLocalLabours}) {
  const {
    labours, setLabours
  } = useAppContext();


  // Handling Revoke Button
  const handleRevoke = (e, labourObj, labourIdx) => {
    // console.log("Revoke")
    e.preventDefault();
    const confirmUpdate = confirm(`Confirm Revoke to ShiftMarking for labour ${labourObj.labourName} ?`)

    if(confirmUpdate) {

      const removedShiftData = {...labourObj, shift: ""}
      const updatedData = [...labourAttendance, removedShiftData]
      setLabourAttendance(updatedData);
  
      // Labour hidden method once clicked the shift and wait till saving
      const pendingLabourArray = labours.filter((labour) => {
        return labour.teamName === labourObj.teamName? labour.labourName !== labourObj.labourName : labour
      })
      setLabours(pendingLabourArray);
  
      const pendingLocalLabourArray = localLabours.filter((labour) => {
        return labour.teamName === labourObj.teamName? labour.labourName !== labourObj.labourName : labour
      })
      setLocalLabours(pendingLocalLabourArray);
    }
  }

  return (
    <li className="mb-4">
      <div className="grid grid-cols-5 gap-4 items-center">
        <div className="col-span-3">
          <div className="mb-2 flex flex-row items-center">
            <span><IoIosContact /></span>
            <span>{labour.labourName}</span>
          </div>
        </div>
        {/* <div className="flex flex-row items-center">
          {
            labour.status == "P" ? 
            <span className="font-semibold text-green-500">{labour.status}</span>
            :
            <span className="font-semibold text-red-500">{labour.status}</span>
          }
        </div> */}
        <div className="flex flex-row items-center">
            <span className="font-semibold text-green-500">{labour.shift}</span>
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn-xs btn-outline bg-orange-400 text-white" 
            onClick={(e)=> handleRevoke(e, labour, labourIdx)}
          >Revoke</button>
        </div>
      </div> 
    </li>
  )
}