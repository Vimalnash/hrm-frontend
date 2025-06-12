import { useRef } from "react";
import { useAppContext } from "../context/appcontext"

export const CustomModal = ({ isOpen, onClose, title, content, teamObj }) => {
  const {labour, setLabour} = useAppContext();

  const inputLabourRef = useRef(null);

  // Function to add labour to a team for attendance marking
  async function addLabour(){
    const inputLabourValue = {
      labourName: inputLabourRef.current.value,
    } 
    // console.log("inputLabourValue", inputLabourValue);

    let cacheLabour = Object.assign([], labour);
    // console.log("CacheLabour", cacheLabour);

    await labour.map((labour,idx) => {
      // console.log(labour.teamName, val.teamName)
      if(labour.teamName == teamObj.teamName) {
        // console.log("TeamName", val.teamName);
        cacheLabour[idx].labours.push(inputLabourValue)
      }
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

