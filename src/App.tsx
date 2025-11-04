import { useState, useCallback } from 'react';
import YearCard from './components/YearCard'
import './App.scss'
import { v7 as uuidv7 } from 'uuid'
import type {Year} from "./DataClasses.ts";

function App() {
  const [yearList, setYearList] = useState<Year[]>([]);

  function addYear() {
    const uuid = uuidv7();
    setYearList([...yearList, {id: uuid, trimesters: []}])
  }

  function generateYearCards() {
    return <>
      {yearList.map((year, index) => {
        return <YearCard yearNumber={index+1} key={year.id} year={year} deleteCallback={deleteYearCard} />
      })}
    </>
  }

  const deleteYearCard = useCallback((yearId : string) => {
    setYearList(yearList.filter((i) => i.id !== yearId))
  }, [yearList])

  return (
    <>
      <header className="appHeader">
        <h1>Victoria University GPA Calculator</h1>
      </header>
      <main className="container-fluid">
          <div className="sidebar">
            <button className="yearButton" onClick={addYear}>Add Year</button>
            <button className="yearButton secondary">Calculate</button>
          </div>
          <div className="mainbar">
            {generateYearCards()}
          </div>
      </main>
      <footer>
        <small>Created 2025 by Zoe. Published under the GNU Affero General Public License version 3.</small>
      </footer>
    </>
  )
}

export default App
