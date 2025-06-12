import { useEffect, useState } from "react";
import { useAppContext } from "../context/appcontext"

export function TeamList({ isOpen, onClose, title, teamNamesArray }) {
  const {labour} = useAppContext();

  const [selectedList, setSelectedList] = useState([]);

  // console.log(teamArray);

  function handleChange(teamName) {
    if(selectedList.includes(teamName)) {
      const removedTeamName = selectedList.filter((val, idx) => val !== teamName)
      setSelectedList(removedTeamName)
    } else {
      setSelectedList([...selectedList, teamName])
    }

  }

  function showTeamList() {
    labour.filter(val => val.teamName == selectedList.includes(val.teamName))
  }

  return (
    <>
      {
        isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{title}</h3>
            <div>
              <ul>
                {
                  teamNamesArray.map((teamName, idx) => {
                    return (
                      <li key={idx}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedList.includes(teamName)}
                            value={teamName}
                            onChange={() => handleChange(teamName)}
                          />
                          <span>
                            {teamName}
                          </span>
                        </label>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
          <div className="modal-action">
            <button className="btn btn-sm" onClick={showTeamList}>Add</button>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </dialog>
      )}

    </>
  )
}

