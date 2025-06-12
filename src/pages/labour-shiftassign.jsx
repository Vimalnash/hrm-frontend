import { useEffect, useRef, useState } from "react";
import { PageTitle } from "../components/pagetitle";
import { useAppContext } from "../context/appcontext";
import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export function LabourShiftAssign() {
    const {
    labour, setLabour, attendanceData, 
    setAttendanceData, 
    showNewEntry, setShowNewEntry
  } = useAppContext();

  const navigate = useNavigate();

  const [attendanceLabourData, setAttendanceLabourData] = useState();
  const [show, setShow] = useState(false);
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

  useEffect(()=> {
      // console.log("useeffectdate", date, project)
    const localCache = JSON.parse(localStorage.getItem("attendanceDetails"))
    // console.log(localCache)
    if(!localCache) { 
      setAttendanceData([])
    } else setAttendanceData(localCache)
  }, [])

  useEffect(() => {
    setShow(false);
  },[attendaceDate, project])

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

  const handleShiftAssign = () => {
    // console.log(date.current.value)
    const selectedDate = attendaceDate;
    const selectedProject = project;
    // console.log(selectedDate, selectedProject)
    if (!selectedDate || !selectedProject) {
      alert("Required to select date and project to generate report")
    } else {
      console.log("AttendanceDataFromDB", attendanceData)
      const filteredDateData = attendanceData
      .filter((val, idx) => {
        return val.date === attendaceDate && val.project === project
      })
      console.log("filtered data", filteredDateData[0])
      setAttendanceLabourData(filteredDateData[0]);
      setShow(true)
    }
  }

  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleShiftUpdate(e);
  }

  const handleShiftUpdate = (e) => {
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
        const confirmResave = confirm("Confirm Saving Shift Data?");
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

  return (
    <>
    <PageTitle><p>Labour Attendance</p></PageTitle>

    <div className="mt-2 md:px-32 border-2 p-5">
      <div className="my-4 flex flex-row gap-8">
        <div className="flex flex-col gap-2">
          <label>Project</label>
          <select className="w-48 shadow-md select select-sm" onChange={(e)=>setProject(e.target.value)}>
            <option value={""}>Select</option>
            <option value={"project1"}>Project1</option>
            <option value={"project2"}>Project2</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label>Team</label>
          <select ref={team} className="w-48 shadow-md select select-sm">
            <option></option>
            <option value={"Sakthival"}>Sakthival Team</option>
            <option value={"Gokul"}>Gokul Team</option>
          </select>
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
        <button className="btn btn-sm bg-blue-400 text-white rounded-md"  onClick={() => {handleShiftAssign(); navigate("/shiftassign")} }>Shifts</button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md" >Report</button>
      </div>
      <div className="w-full p-4 flex flex-col md:flex-row gap-2 justify-center items-center">
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => navigate("/labourattendance")}>Pending</button>
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => {navigate("/shiftassign"); handleShiftAssign(); } }>AtWork</button>
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => {navigate("/report/labourattendance"); handleReport();}}>Marked</button>
      </div>
      {
      show &&
      <div className="my-4">
        <ul className="">
          {
            attendanceLabourData ? 
            (
            <div>
              {
              attendanceLabourData.teamDetails.map((teamObj, teamIdx, teamDetails) => {
                return <LabourTeamList key={teamIdx} teamObj={teamObj} teamIdx={teamIdx} status="P"
                teamDetails={teamDetails} />
              })
              }
            </div>
            )
            :
            (
              <h3>No Present Data for the selected Date</h3>
            )
          }
        </ul>
        <div className="flex justify-center">
          <button type="submit" className="btn btn-success" onClick={(e) => handleSubmit(e)}>Save Shift</button>
        </div>
        <div>
          {saveSuccess? <p className="text-green-400">SavedSuccessfully</p> : "" }
          {saveFailure? <p className="text-red-400">Failed to Save</p> : "" }
        </div>
      </div>
      }

    </div>
    </>
  )
}


function LabourTeamList({teamObj, teamIdx, teamDetails, status}) {
  // console.log(teamObj)
  return (
    <li className="p-2 border-b-2 border-blue-200">
      <div className="mb-2 text-blue-300">
        {teamObj.teamName}
      </div>
      <div className="mb-4">
        <ul>
          {
            teamObj.labours
            .filter((labourObj, labourIdx) => {
              return labourObj.status == status
            })
            .map((labourObj, labourIdx) => {
              return (
                <LabourList 
                  key={labourIdx}
                  labourObj={labourObj} labourIdx={labourIdx} 
                  teamIdx={teamIdx} teamDetails={teamDetails} />
              )
            })
          }
        </ul>
      </div>
    </li>
  )
}

function LabourList({labourObj, labourIdx, teamIdx, teamDetails }) {
  const {labour, setLabour} = useAppContext();
  const [shiftSelected, setShiftSelected] = useState();

  const handleShiftChange = async (e, shiftval, labourObj, labourIdx) => {
    e.preventDefault();
    console.log("selectedshift", shiftval)
    let cacheLabour = Object.assign([], teamDetails);
    setShiftSelected(shiftval);

    if(labourObj.labourName == await cacheLabour[teamIdx].labours[labourIdx].labourName) {
      cacheLabour[teamIdx].labours[labourIdx] = {...labourObj, shift: shiftval}
    }
    console.log("cacheLabour", cacheLabour)

    setLabour(cacheLabour);
  }

  const handleRevoke = async (e, labourObj, labourIdx) => {
    // console.log("Revoke")
    e.preventDefault();
    let cacheLabour = Object.assign([], teamDetails);

    if(labourObj.labourName == await cacheLabour[teamIdx].labours[labourIdx].labourName) {
      cacheLabour[teamIdx].labours[labourIdx] = {...labourObj, shift: ""}
    }
    console.log("cacheLabour", cacheLabour)

    setLabour(cacheLabour);
  }

  return (
    <li key={labourIdx} className="mb-4">
      <div className="grid grid-cols-5 gap-4 items-center">
        <div className="col-span-3">
          <div className="mb-2 flex flex-row items-center">
            <span><IoIosContact /></span>
            <span>{labourObj.labourName}</span>
          </div>
          <div className="flex md-flex-row gap-2">
            <button  
              onClick={(e)=>{handleShiftChange(e, "0.25", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift) == 0.25? "bg-orange-200" : ""} `}>
                0.25
            </button>
            <button  
              onClick={(e)=>{handleShiftChange(e, "0.5", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift)  == 0.5? "bg-orange-200" : ""} `}>
                0.5
            </button>
            <button  
              onClick={(e)=>{handleShiftChange(e, "0.75", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift)  == 0.75? "bg-orange-200" : ""} `}>
                0.75
            </button>
            <button  
              onClick={(e)=>{handleShiftChange(e, "1.25", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift)  == 1.25? "bg-orange-200" : ""} `}>
                1.25
            </button>
            <button  
              onClick={(e)=>{handleShiftChange(e, "1.5", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift)  == 1.5? "bg-orange-200" : ""} `}>
                1.5
            </button>
            <button  
              onClick={(e)=>{handleShiftChange(e, "1.75", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift)  == 1.75? "bg-orange-200" : ""} `}>
                1.75
            </button>
            <button  
              onClick={(e)=>{handleShiftChange(e, "2", labourObj, labourIdx)}} 
              className={`w-8 btn btn-xs rounded-lg border-gray-400 ${(shiftSelected || labourObj.shift)  == 2? "bg-orange-200" : ""} `}>
                2
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center">
          {
            labourObj.status == "P" ? 
            <span className="font-semibold text-green-500">{labourObj.status}</span>
            :
            <span className="font-semibold text-red-500">{labourObj.status}</span>

          }
        </div>
        <div className="flex gap-2">
          <button className="btn btn-xs btn-outline bg-orange-400 text-white" onClick={(e)=> handleRevoke(e, labourObj, labourIdx)}>Revoke</button>
        </div >
      </div> 
    </li>
  )
}