import type {Year, Trimester, Course} from "../DataClasses.ts";
import {useCallback, useEffect, useState} from "react";
import { v7 as uuidv7 } from 'uuid'
import TrimesterCard from "./TrimesterCard.tsx";
import {useMountEffect} from "../utils/UseMountEffect.ts";

export default function YearCard({ yearNumber, year, deleteCallback, updateCallback }:
{ yearNumber: number, year: Year, deleteCallback: (yearId: string) => void, updateCallback: (yearId: string, trimesterList: Trimester[]) => void }
) {
  const [trimesterList, setTrimesterList] = useState<Trimester[]>([]);

  useEffect(() => {
    updateCallback(year.id, trimesterList)
  }, [trimesterList, year.id])

  useMountEffect(() => setTrimesterList(year.trimesters))

  function addTrimester() {
    const uuid = uuidv7();
    setTrimesterList([...trimesterList, {id: uuid, courses: []}])
  }

  function generateTrimesterCards() {
    return <>
      {trimesterList.map((trimester, index) => {
        return <TrimesterCard trimesterNumber={index+1} key={trimester.id} trimester={trimester} deleteCallback={deleteTrimesterCard} updateCallback={updateTrimesterCard} />
      })}
    </>
  }

  const deleteTrimesterCard = useCallback((trimesterId : string) => {
    setTrimesterList(trimesterList.filter((i) => i.id !== trimesterId))
  }, [trimesterList])

  const updateTrimesterCard = useCallback((trimesterId : string, courseList : Course[]) => {
    setTrimesterList(() => {
      const idx = trimesterList.findIndex(t => t.id == trimesterId);
      return [...trimesterList.slice(0, idx), {id: trimesterId, courses: courseList}, ...trimesterList.slice(idx + 1)]
    })
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