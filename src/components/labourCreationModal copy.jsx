import { useRef } from "react";
import { useAppContext } from "../context/appcontext"

export function LabourCreationModal({val}) {
  const {labour, setLabour} = useAppContext();

  const inputLabourRef = useRef(null);

  console.log("props", val)

  // Function to add labour to a team for attendance marking
  async function addLabour(e, val){

    // e.preventDefault()
    const inputLabourValue = {
      labourName: inputLabourRef.current.value,
    } 
    console.log("inputLabourValue", inputLabourValue);

    let cacheLabour = Object.assign([], labour);
    console.log("CacheLabour", cacheLabour)

    await labour.map((val,idx) => {
      console.log(val.teamName, val)
      if(val.teamName == val) {
        console.log(val.teamName)
        cacheLabour[idx].labours.push(inputLabourValue) 
      }
    })

    setLabour(cacheLabour);
  }
  return (
    <>    
    {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Add Labour for : {val.teamName}</p>
          <div>
            <form>
              <div className="flex flex-col">
                <label htmlFor="labourname">LabourName</label>
                <input
                  ref={inputLabourRef}
                  type="text"
                  name="labourname"
                  className="input"
                />
              </div>
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm" onClick={(e, val) => addLabour(e, val)}>Add</button>
              <button className="btn btn-sm">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}


