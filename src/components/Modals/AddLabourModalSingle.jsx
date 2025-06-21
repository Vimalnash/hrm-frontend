import { useRef } from "react";
import { useAppContext } from "../../context/appcontext"

// Function to add a LabourName from the popup in attendance marking form
export const AddLabourModalSingle = ({ isOpen, onClose, title, content, team, localLabours, setLocalLabours }) => {
  const {
    labours, setLabours,
    teams,
    laboursListLocal, setLaboursListLocal,
  } = useAppContext();
  const inputLabourRef = useRef(null);

  // Function to add labour to a team for attendance marking
  function addLabour() {
    const newLabourName = inputLabourRef.current.value;

    const toAddLabourObj = { labourName: newLabourName, teamName: team };
    const updatedOnScreenList = [...labours, toAddLabourObj]
    inputLabourRef.current.value = "";
    setLabours( updatedOnScreenList );

    // Getting List from browser db and adding new Labours and updating the db. 
    const dbTeamLabourList =  JSON.parse(localStorage.getItem("dbTeamLabourList"));
    const updatedDbTeamLabourList = {
      teams: dbTeamLabourList.teams, 
      labours: [...dbTeamLabourList.labours, toAddLabourObj]
    }
    localStorage.setItem("dbTeamLabourList",  JSON.stringify(updatedDbTeamLabourList));

    const updatedLocalLabourList = [...localLabours, toAddLabourObj]
    setLocalLabours(updatedLocalLabourList);
  }

  return (
    <>
      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-gray-500">{title}</h3>
            <p className="py-4 text-gray-500">{content}Add Labour for : {team}</p>
            <div>
              <div>
                <div className="flex flex-col">
                  <label htmlFor="labourname" className="text-gray-500">LabourName</label>
                  <input
                    required
                    ref={inputLabourRef}
                    type="text"
                    placeholder="LabourName"
                    pattern="[A-Za-z][A-Za-z]*"
                    minlength="2"
                    maxlength="30"
                    title="Only letters"
                    name="labourname"
                    className="input text-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-sm" onClick={addLabour}>Add</button>
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};