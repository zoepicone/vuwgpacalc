import {useState, useCallback} from 'react';
import YearCard from './components/YearCard'
import './App.scss'
import { v7 as uuidv7 } from 'uuid'
import {Grades, type Trimester, type Year} from "./DataClasses.ts";
import localForage from "localforage";
import {useMountEffect} from "./utils/UseMountEffect.ts";

function App() {
  const [yearList, setYearList] = useState<Year[]>([]);
  const [gpa, setGpa] = useState<number>(NaN);

  useMountEffect(() => {
    localForage.getItem('yearList', function (err, data : Year[] | null) {
      if (err || !data) return;
      console.log(data)
      setYearList(data);
    });
  });

  function addYear() {
    const uuid = uuidv7();
    setYearList([...yearList, {id: uuid, trimesters: []}])
  }

  function generateYearCards() {
    return <>
      {yearList.map((year, index) => {
        return <YearCard yearNumber={index+1} key={year.id} year={year} deleteCallback={deleteYearCard} updateCallback={updateYearCard} />
      })}
    </>
  }

  const deleteYearCard = useCallback((yearId : string) => {
    setYearList(yearList.filter((i) => i.id !== yearId))
  }, [yearList])

  const updateYearCard = useCallback((yearId : string, trimesterList : Trimester[]) => {
    setYearList(() => {
      const idx = yearList.findIndex(y => y.id == yearId);
      return [...yearList.slice(0, idx), {id: yearId, trimesters: trimesterList}, ...yearList.slice(idx + 1)]
    })
  }, [yearList])

  function calculateGpa() {
    const courses = yearList.flatMap((year) => {
      return year.trimesters.flatMap((trimester) => {
        return trimester.courses
      })
    })
    const calcData = courses.map((course) => {
      // @ts-expect-error - there should be no blank string at this point
      // of course i haven't written validation yet so there probably will be lol
      return [Grades[course.grade], course.points]
    })
    const totalPoints = calcData.reduce((acc, current) => acc+current[1], 0)
    const totalGradePoints = calcData.reduce((acc, current) => acc + (current[0] * current[1]), 0)

    setGpa(totalGradePoints / totalPoints)
    localForage.setItem('yearList', yearList)
  }

  return (
    <>
      <header className="appHeader">
        <h1>Victoria University GPA Calculator</h1>
      </header>
      <main className="container-fluid">
          <div className="sidebar">
            <button className="yearButton" onClick={addYear}>Add Year</button>
            <button className="yearButton secondary" onClick={calculateGpa}>Calculate</button>
            {!isNaN(gpa) &&
            <h5>Your grade point average is <b>{gpa.toPrecision(2)}</b></h5>}
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
