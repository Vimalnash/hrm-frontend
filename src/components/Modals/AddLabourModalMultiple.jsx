import { useRef } from "react";
import { useAppContext } from "../../context/appcontext"
import { IoIosContact } from "react-icons/io";

// Function to add a LabourName from the popup in attendance marking form
export const AddLabourModalMultiple = ({ isOpen, onClose, title, content, team, localLabours, setLocalLabours }) => {
  const {
    labours, setLabours,

  } = useAppContext();
  const inputMaleLabourRef = useRef(null);
  const inputFemaleLabourRef = useRef(null);

  // Function to add labour to a team for attendance marking
  function addLabour() {
    const maleCount = inputMaleLabourRef.current.value;
    const femaleCount = inputFemaleLabourRef.current.value;

    const newMaleLaboursList = [];
    for (let i=1; i<=maleCount; i++) {
      newMaleLaboursList.push({ labourName: `LabourMaleAuto${i}`, teamName: team });
    };

    const newFemaleLaboursList = [];
    for (let i=1; i<=femaleCount; i++) {
      newFemaleLaboursList.push({ labourName: `LabourFemaleAuto${i}`, teamName: team });
    };

    const updatedOnScreenList = [...labours, ...newMaleLaboursList, ...newFemaleLaboursList];
    setLabours(updatedOnScreenList);

    inputMaleLabourRef.current.value = "";
    inputFemaleLabourRef.current.value = "";

    // Getting List from browser db and adding new Labours and updating the db.
    const dbTeamLabourList =  JSON.parse(localStorage.getItem("dbTeamLabourList"));
    const updatedDbTeamLabourList =
      {
        teams: dbTeamLabourList.teams, 
        labours: [...dbTeamLabourList.labours,  ...newMaleLaboursList, ...newFemaleLaboursList]
      }
    localStorage.setItem("dbTeamLabourList",  JSON.stringify(updatedDbTeamLabourList));

    const updatedLocalLabourList = [...localLabours, ...newMaleLaboursList, ...newFemaleLaboursList];
    setLocalLabours(updatedLocalLabourList);

  }
  
  return (
    <>
      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg  text-gray-500">{title}</h3>
            <p className="py-4 text-sm  text-blue-500">{content}</p>
            <p className="py-4 text-lg font-semibold text-blue-500">{team}</p>
            <div>
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-row flex-wrap gap-8 justify-around items-center">
                  <span className="flex flex-row gap-2 justify-center items center">
                    <span><IoIosContact /></span>
                    <label htmlFor="malelabour" className="text-gray-500">Number of Males</label>
                  </span>
                  <input
                    required
                    ref={inputMaleLabourRef}
                    type="number"
                    placeholder="malelabour"
                    min="1"
                    max="10"
                    title="Only Number, Input Value no more than 10"
                    name="malelabour"
                    className="input w-30 text-gray-500"
                  />
                </div>
                <div className="flex flex-row flex-wrap gap-8 justify-around items-center">
                  <span className="flex flex-row gap-2 justify-center items center">
                    <span><IoIosContact /></span>
                    <label htmlFor="femalelabour" className="text-gray-500">Number of Females</label>
                  </span>
                  <input
                    required
                    ref={inputFemaleLabourRef}
                    type="number"
                    placeholder="femalelabour"
                    min="1"
                    max="10"
                    title="Only Number, Input Value no more than 10"
                    name="femalelabour"
                    className="input w-30 text-gray-500"
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
              <button className="btn btn-sm" onClick={addLabour}>Generate</button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};