import { useEffect, useRef, useState } from "react";
import { CustomModal } from "../components/labourCreationModal";
import { PageTitle } from "../components/pagetitle";
import { useAppContext } from "../context/appcontext";
import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TeamList } from "../components/teamlist";

export function LabourAttendance() {
  const {
    labour, setLabour, attendanceData, 
    setAttendanceData, 
    showNewEntry, setShowNewEntry
  } = useAppContext();

  const navigate = useNavigate();

  const[saveSuccess,setSaveSuccess] = useState(false);
  const[saveFailure,setSaveFailure] = useState(false);
  const[attendaceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  })
  const[project, setProject] = useState();

  // const dateRef = useRef(today);
  // const projectRef = useRef();
  const team = useRef();

  const [isModalOpen, setModalOpen] = useState(false);
  const [teamNamesArray, setTeamNamesArray] = useState([]);

  // console.log("date&project", date, project, attendanceData)
  useEffect(() => {
    const teamList = labour.map((val) => {
      return val.teamName
    })
    setTeamNamesArray(teamList)
  }, [])

  useEffect(()=> {
      // console.log("useeffectdate", date, project)
    const localCache = JSON.parse(localStorage.getItem("attendanceDetails"))
    // console.log(localCache)
    if(!localCache) { 
      setAttendanceData([])
    } else setAttendanceData(localCache)
  }, [])

  useEffect(()=>{
      attendanceData.map((objVal, idx) => {
        console.log("useeffectdate", attendaceDate, project)
        if(objVal.date === attendaceDate && objVal.project === project) {
          alert("Data Available for this Date and project");
          setLabour(objVal.teamDetails)
          setShowNewEntry(false);
        }
      })
  },[attendaceDate, project])

  
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  function addaDayToDate(date) {
    console.log(date)
    const nextDate = new Date(date);
    console.log(nextDate)
    nextDate.setDate(nextDate.getDate() + 1)
    setAttendanceDate(nextDate.toISOString().split('T')[0])
  }

  function subtractaDayToDate(date) {
    console.log(date)
    const nextDate = new Date(date);
    console.log(nextDate)
    nextDate.setDate(nextDate.getDate() - 1)
    setAttendanceDate(nextDate.toISOString().split('T')[0])
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if(showNewEntry) {
      handleNewSave(e);
    } else {
      handleUpdate(e);
    }
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    const selectedDate = attendaceDate;
    const selectedProject = project;

    if(!selectedDate || !selectedProject) {
      alert("! Required fields  Date, Project")
    }

    let formAttendanceData = {
      date : selectedDate,
      project : selectedProject,
      teamDetails: labour
    }

    attendanceData.map((objVal, idx) => {
      console.log("useeffectdate", date, project)
      if(objVal.date == attendaceDate && objVal.project == project) {
        const confirmResave = confirm("Do you wish to Resave the Data?");
        if (confirmResave) {
          attendanceData[idx] = formAttendanceData
          const newAttendanceData = [...attendanceData]
          setAttendanceData(newAttendanceData)
          localStorage.setItem("attendanceDetails", JSON.stringify(newAttendanceData));
          setProject("")
          setDate("")
          setSaveSuccess(true)
          setTimeout(() => {
            setSaveSuccess(false)
            location.reload();
          }, 1000);
        }
      }
    })
  }

  const handleNewSave = (e) => {
    e.preventDefault();
    const selectedDate = attendaceDate;
    const selectedProject = project;

    if(!selectedDate || !selectedProject) {
      alert("! Required fields  Date, Project")
    }

    let formAttendanceData = {
      date : selectedDate,
      project : selectedProject,
      teamDetails: labour
    }

    console.log("formattendancedata", formAttendanceData);
    const newAttendanceData = [...attendanceData, formAttendanceData]
    setAttendanceData(newAttendanceData)
    localStorage.setItem("attendanceDetails", JSON.stringify(newAttendanceData));
    setProject("")
    setDate("")
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      location.reload();
    }, 1000);
    
  }


  return (
    <>
    <PageTitle><p>Labour Attendance</p></PageTitle>
    
    <div className="mt-2 md:px-32 border-2 p-5" >
      <div className="my-4 flex flex-col gap-4 md:flex-row md:gap-8">
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
          <select ref={team} className="w-48 shadow-md select select-sm">
            <option value={""}>Select</option>
            <option value={"Sakthival"}>Sakthival Team</option>
            <option value={"Gokul"}>Gokul Team</option>
          </select>
        </div>
        <div>
          <button className="btn btn-xs" onClick={openModal}>=</button>
          <TeamList
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Select Team"
            content=""
            teamNamesArray = {teamNamesArray}
          />
        </div>
      </div>
      <div className="my-4 flex justify-center gap-4 ">
        <button 
          className="btn btn-sm bg-gray-500 text-white" 
          onClick={()=> subtractaDayToDate(attendaceDate)}
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
      <div className="w-full p-4 bg-blue-50 flex justify-around">
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">Labours</button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">At Works</button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">Shifts</button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">Absent</button>
      </div>
      <div className="w-full p-4 flex flex-col md:flex-row gap-2 justify-center items-center">
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => navigate("/labourattendance")}>Pending</button>
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => {navigate("/shiftassign"); handleShiftAssign(); } }>AtWork</button>
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => {navigate("/report/labourattendance"); handleReport();}}>Marked</button>
      </div>
      <div className="my-4">
        <ul className="">
          {
            labour&& (
              labour.map((val,idx) => {
                return <LabourTeamList key={idx} teamObj={val} teamIdx={idx} />
              })
            )
          }
        </ul>
      </div>
      <div className="flex justify-center">
        {
          showNewEntry ?
          <button type="submit" className="btn btn-success" onClick={(e) => handleSubmit(e)}>Save Attendance</button>
          :
          <button type="submit" className="btn btn-success" onClick={(e) => handleSubmit(e)}>Update Attendance</button>
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


function LabourTeamList({teamObj, teamIdx}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const {labour, setLabour} = useAppContext();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handlePresent = (labourObj, labourIdx) => {
    let cacheLabour = Object.assign([], labour);
    console.log("cachelabour", cacheLabour);
    // console.log("teamIdx", teamIdx);
    // console.log("labourObj", labourObj);
    // console.log("LabourIdx", labourIdx);
    // console.log("cachelabourTeamIdx", cacheLabour[teamIdx]);

    if(labourObj.labourName == cacheLabour[teamIdx].labours[labourIdx].labourName) {
      cacheLabour[teamIdx].labours[labourIdx] = {...labourObj, status: "P"}
    }

    setLabour(cacheLabour);
  }

  const handleAbsent = (labourObj, labourIdx) => {
    let cacheLabour = Object.assign([], labour);

    if(labourObj.labourName == cacheLabour[teamIdx].labours[labourIdx].labourName) {
      cacheLabour[teamIdx].labours[labourIdx] = {...labourObj, status: "A"}
    }

    setLabour(cacheLabour);
  }

  return (
    <li className="p-2 border-b-2 border-blue-200">
      <div className="mb-2 text-blue-300">
        {teamObj.teamName} 
        <span className="p-6">
          <button className="btn btn-xs" onClick={openModal}>Add Labour</button>

          <CustomModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Add Labour"
            content=""
            teamObj = {teamObj}
          />
        </span>
      </div>
      <div className="mb-4">
        <ul>
          {teamObj.labours.map((labourObj, labourIdx) => {
            return (
              <li key={labourIdx} className="mb-4">
                <div className="flex flex-col md:grid md:grid-cols-4 md:gap-4">
                  <div className="col-span-2 flex flex-row items-center ">
                    <span><IoIosContact /></span>
                    <span>{labourObj.labourName}</span>
                  </div>
                  <div className="flex flex-row items-center">Status : &nbsp;
                    {
                      labourObj.status == "P" ? 
                      <span className="font-semibold text-green-500">{labourObj.status}</span>
                      :
                      <span className="font-semibold text-red-500">{labourObj.status}</span>

                    }
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-outline btn-success" onClick={() => handlePresent(labourObj, labourIdx)}>Present</button>
                    <button className="btn btn-xs btn-outline btn-error" onClick={() => handleAbsent(labourObj, labourIdx)}>Absent</button>
                  </div >
                </div> 
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

