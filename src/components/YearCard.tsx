import type {Year, Trimester} from "../DataClasses.ts";
import {useCallback, useState} from "react";
import { v7 as uuidv7 } from 'uuid'
import TrimesterCard from "./TrimesterCard.tsx";

export default function YearCard({ yearNumber, year, deleteCallback }: { yearNumber: number, year: Year, deleteCallback: (yearId: string) => void }) {
  const [trimesterList, setTrimesterList] = useState<Trimester[]>([]);

  function addTrimester() {
    const uuid = uuidv7();
    setTrimesterList([...trimesterList, {id: uuid, courses: []}])
  }

  function generateTrimesterCards() {
    return <>
      {trimesterList.map((trimester, index) => {
        return <TrimesterCard trimesterNumber={index+1} key={trimester.id} trimester={trimester} deleteCallback={deleteTrimesterCard} />
      })}
    </>
  }

  const deleteTrimesterCard = useCallback((trimesterId : string) => {
    setTrimesterList(trimesterList.filter((i) => i.id !== trimesterId))
  }, [trimesterList])

  return (
    <article className="year-card">
      <header>
        <h3>Year {yearNumber}</h3>
        <div className="yearCardButtons">
          <button className="trimesterButton" onClick={addTrimester} disabled={trimesterList.length > 2}>Add Trimester</button>
          <button className="deleteYearButton outline secondary" onClick={() => deleteCallback(year.id)}>🗑︎</button>
        </div>
      </header>
      <main className="container">
        {generateTrimesterCards()}
      </main>
    </article>
  )
}