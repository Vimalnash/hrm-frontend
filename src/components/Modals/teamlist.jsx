import { useState } from "react";
import { useAppContext } from "../../context/appcontext"

// Multiple selection modal for teams rendering
export function TeamList({ isOpen, onClose, title, setSelectedTeams, localLabours, setLocalLabours  }) {
  const {setLabours, teams} = useAppContext();

  const [selectedList, setSelectedList] = useState([]);
  // console.log(teamNamesArray);

  // Handling Selected Array List based on selection.
  function handleChange(teamName) {
    if(selectedList.includes(teamName)) {
      const afterRemovedTeamName = selectedList.filter((val, idx) => val !== teamName);
      setSelectedList(afterRemovedTeamName);
    } else {
      setSelectedList([...selectedList, teamName]);
    }
  }

  // Setting TeamWise Labour Array List based on Multiple selected TeamList
  function loadSelectedTeams() {
    // const dbTeamLabourList =  JSON.parse(localStorage.getItem("dbTeamLabourList"));

    const selectedTeamList = teams.filter(teamName => selectedList.includes(teamName));
    setSelectedTeams(selectedTeamList);
    const selectedTeamLaboursList = localLabours.filter(val => selectedList.includes(val.teamName));
    setLabours(selectedTeamLaboursList);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <dialog className="modal modal-open overflow-scroll">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{title}</h3>
            <div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="labourname">Team Names</label>
                  <ul>
                    {
                      teams.map((teamName, idx) => {
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
                                &nbsp; {teamName}
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
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
              <button className="w-full btn btn-primary btn-sm" onClick={loadSelectedTeams}>Apply</button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}