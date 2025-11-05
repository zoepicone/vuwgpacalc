import type {Course, Trimester} from "../DataClasses.ts";
import {useCallback, useEffect, useState} from "react";
import CourseInput from "./CourseInput.tsx";
import { v7 as uuidv7 } from 'uuid'
import {useMountEffect} from "../utils/UseMountEffect.ts";

export default function TrimesterCard({ trimesterNumber, trimester, deleteCallback, updateCallback }:
{ trimesterNumber: number, trimester: Trimester, deleteCallback: (trimesterId: string) => void, updateCallback: (trimesterId: string, courseList: Course[]) => void }
) {
  const [courseList, setCourseList] = useState<Course[]>([]);

  useEffect(() => {
    updateCallback(trimester.id, courseList)
  }, [courseList, trimester.id])

  useMountEffect(() => setCourseList(trimester.courses))

  function addCourse() {
    const uuid = uuidv7();
    setCourseList([...courseList, {id: uuid, name: '', grade: '', points: ''}])
    trimester.courses.push({ id: uuid, name: '', grade: '', points: ''});
  }

  const deleteCourse = useCallback((courseId : string) => {
    setCourseList(courseList.filter((i) => i.id != courseId));
  }, [courseList])

  const updateCourse = (courseId: string, eventName: string, eventValue: string | number) => {
    setCourseList(courseList => {
      return courseList.map(course => course.id == courseId ? {...course, [eventName]: eventValue} : course)
    })
  }

  function generateCourseRows() {
    return <>
      {courseList.map((course: Course) => {
        return (
          <tr key={course.id} className="courseRow">
            <td>
              <CourseInput course={course} deleteCallback={deleteCourse} handleChange={updateCourse} key={course.id} />
            </td>
          </tr>
        )
      })}
    </>

  }

  return (
    <article className="trimester-card">
      <header>
        <h3>Trimester {trimesterNumber}</h3>
        <div className="yearCardButtons">
          <button className="trimesterButton" onClick={addCourse}>Add Course</button>
          <button className="deleteYearButton outline" onClick={() => deleteCallback(trimester.id)}>🗑︎</button>
        </div>
      </header>
      <main className="container">
        <table>
          <tbody>
            {generateCourseRows()}
          </tbody>
        </table>
      </main>
    </article>
  )
}
