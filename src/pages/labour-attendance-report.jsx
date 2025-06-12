import { useEffect, useRef, useState } from "react";
import { PageTitle } from "../components/pagetitle";
import { useAppContext } from "../context/appcontext";
import { IoIosContact } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export function LabourAttendanceReport() {
  const {attendanceData, setAttendanceData} = useAppContext();
  const navigate = useNavigate();

  const [attendanceLabourData, setAttendanceLabourData] = useState();
  const [show, setShow] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  const[attendaceDate, setAttendanceDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  })
  const[project, setProject] = useState();

  // const dateRef = useRef(today);
  // const projectRef = useRef();
  const team = useRef();

  useEffect(()=> {
    setAttendanceData(JSON.parse(localStorage.getItem("attendanceDetails")))
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

  const handleReport = () => {
    const selectedDate = attendaceDate;
    const selectedProject = project;
    // console.log(selectedDate, selectedProject)
    if (!selectedDate || !selectedProject) {
      alert("Required to select date and project to generate report")
    } else {
      console.log("messaage", attendanceData)
      const filteredDateData = attendanceData
      .filter((val, idx) => {
        return val.date === attendaceDate && val.project === project
      })
      console.log("filtered data", filteredDateData[0])
      setAttendanceLabourData(filteredDateData[0]);
      setShow(true)
      findPresentCount(filteredDateData)
      findAbsentCount(filteredDateData)
    }
  }

  function findPresentCount (filteredDateData) {
    const presentDataCount = filteredDateData[0].teamDetails.reduce((acc, teamObj) => {
        let count = 0
        for (let i=0; i<teamObj.labours.length; i++) {
          if( teamObj.labours[i].status == "P" && (
              teamObj.labours[i].shift == "0.25" || 
              teamObj.labours[i].shift == "0.5" || 
              teamObj.labours[i].shift == "0.75" || 
              teamObj.labours[i].shift == "1.25" || 
              teamObj.labours[i].shift == "1.5" || 
              teamObj.labours[i].shift == "1.75" || 
              teamObj.labours[i].shift == "2"
            )) {
              count = count + 1;
            }
        }
        acc = acc + count
        return acc
      },0)

    setPresentCount(presentDataCount)
  }

  function findAbsentCount (filteredDateData) {
    const absentDataCount = filteredDateData[0].teamDetails.reduce((acc, teamObj) => {
        let count = 0
        for (let i=0; i<teamObj.labours.length; i++) {
          if( teamObj.labours[i].status == "A") {
              count = count + 1;
            }
        }
        acc = acc + count
        return acc
      },0)

    setAbsentCount(absentDataCount)
  }

  return (
    <>
    <PageTitle><p>Labour Attendance</p></PageTitle>

    <div className="mt-2 md:px-32 border-2 p-5">
      <div className="my-4 flex flex-row gap-8">
        <div className="flex flex-col gap-2">
          <label>Project</label>
          <select className="w-48 shadow-md select select-sm" onChange={(e)=>setProject(e.target.value)}>
            <option></option>
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
        <button className="btn btn-sm bg-blue-400 text-white rounded-md">Shifts</button>
        <button className="btn btn-sm bg-blue-400 text-white rounded-md" onClick={handleReport}>Report</button>
      </div>
      <div className="w-full p-4 flex flex-col md:flex-row gap-2 justify-center items-center">
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => navigate("/labourattendance")}>Pending</button>
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => {navigate("/shiftassign"); handleShiftAssign(); } }>AtWork</button>
        <button className="btn btn-xs bg-gray-100 border-gray-400" onClick={() => {navigate("/report/labourattendance"); handleReport();}}>Marked</button>
      </div>
      {
      show &&
      <div className="my-4">
        <p className="w-full h-8 bg-green-500 text-white flex items-center justify-center">
          Present+ShiftAssigned &#40;{presentCount}&#41;
        </p>
        <ul className="">
          {
            attendanceLabourData ? 
            (
            <div>
              {
              attendanceLabourData.teamDetails.map((teamObj, teamIdx) => {
                // console.log("project", val.project, project.current.value, val.date, date.current.value)
                // console.log("teammap", teamObj)
                return <LabourTeamList key={teamIdx} teamObj={teamObj} teamIdx={teamIdx} status="P" />
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
        
        <p className="w-full h-8 bg-red-400 text-white flex items-center justify-center">
          Absent &#40;{absentCount}&#41;
        </p>
        <ul className="">
          {
            attendanceLabourData ? 
            (
            <div>
              {
              attendanceLabourData.teamDetails.map((teamObj, teamIdx) => {
                // console.log("teammap", teamObj)
                return <LabourTeamList key={teamIdx} teamObj={teamObj} teamIdx={teamIdx} status="A" />
              })
              }
            </div>
            )
            :
            (
              <h3>No Absent Data for the selected Date</h3>
            )
          }
        </ul>
      </div>
      }
    </div>
    </>
  )
}


function LabourTeamList({teamObj, teamIdx,status}) {
  // console.log(teamObj)
  const {labour, setLabour} = useAppContext();

  const handleRevoke = async (e, labourObj, labourIdx) => {
    console.log("Revoke")
    e.preventDefault();
    let cacheLabour = Object.assign([], teamDetails);

    if(labourObj.labourName == await cacheLabour[teamIdx].labours[labourIdx].labourName) {
      cacheLabour[teamIdx].labours[labourIdx] = {...labourObj, shift: ""}
    }
    console.log("cacheLabour", cacheLabour)

    setLabour(cacheLabour);
  }

  return (
    <li className="p-2 border-b-2 border-blue-200">
      <div className="mb-2 text-blue-300">
        {teamObj.teamName}
      </div>
      <div className="mb-4">
        <ul>
          {teamObj.labours
          .filter((labourObj, labourIdx) => {
            if (status == "P") {
              return labourObj.status == status && (
                labourObj.shift == "0.25" || 
                labourObj.shift == "0.5" || 
                labourObj.shift == "0.75" || 
                labourObj.shift == "1.25" || 
                labourObj.shift == "1.5" || 
                labourObj.shift == "1.75" || 
                labourObj.shift == "2"
              )
            }
            if (status == "A") {
              return labourObj.status == status && (
                labourObj.shift == "" || 
                labourObj.shift == undefined || 
                labourObj.shift == null
              )
            }
          })
          .map((labourObj, labourIdx) => {
            return (
              <li key={labourIdx} className="mb-2">
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2 flex flex-row items-center ">
                    <span><IoIosContact /></span>
                    <span>{labourObj.labourName}</span>
                  </div>
                  <div className="flex flex-row items-center">
                    {
                      labourObj.status == "P" ? 
                      <span className="font-semibold text-green-500">{labourObj.status}</span>
                      :
                      <span className="font-semibold text-red-500">{labourObj.status}</span>

                    }
                  </div>
                  <div className="flex flex-row items-center">
                      <span className="font-semibold text-green-500">{labourObj.shift}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-outline bg-orange-500 text-white" onClick={(e)=> handleRevoke(e, labourObj, labourIdx)}>Revoke</button>
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