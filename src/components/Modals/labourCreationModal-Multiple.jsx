import { useRef } from "react";
import { useAppContext } from "../../context/appcontext"

// Function to add a LabourName from the popup in attendance marking form
export const CustomModal = ({ isOpen, onClose, title, content, teamObj }) => {
  const {labour, setLabour} = useAppContext();
  const inputLabourRef = useRef(null);

  // Function to add labour to a team for attendance marking
  async function addLabour(){
    const inputLabourValue = {
      labourName: inputLabourRef.current.value,
    } 
    let cacheLabour = Object.assign([], labour);
    await labour.some((labour,idx) => {
      if(labour.teamName == teamObj.teamName) {
        cacheLabour[idx].labours.push(inputLabourValue)
      }
      return true
    })

    inputLabourRef.current.value = "";
    setLabour(cacheLabour);
  }

  return (
    <>
      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-4">{content}Add Labour for : {teamObj.teamName}</p>
            <div>
              <div>
                <div className="flex flex-col">
                  <label htmlFor="labourname">LabourName</label>
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
                    className="input"
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