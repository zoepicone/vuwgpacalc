import {type Course, Grades} from "../DataClasses.ts";
import {useCallback} from "react";

export default function CourseInput({ course, deleteCallback, handleChange }: {
  course: Course,
  deleteCallback: (courseId: string) => void,
  handleChange: (courseId: string,
    eventName: string,
    value: string | number) => void }
) {
  function getGrades() {
    const gradesOptions = []
    for (const gradesKey in Grades) {
      const gradesKeyVisual = gradesKey.replace("p", "+")
        .replace("m", "-");
      gradesOptions.unshift(<option key={gradesKey} value={gradesKey}>{gradesKeyVisual}</option>);
    }
    return gradesOptions;
  }

  const onInputChange = useCallback((e: { target: { name: string; value: string | number; }; }) => {
    handleChange(course.id, e.target.name, e.target.value);
  }, [handleChange, course.id]);

  return (
    <form>
      <div className="courseForm">
        <fieldset className="grid courseInput">
          <input name="name" value={course.name} placeholder="Course Name" aria-label="Course Name" onChange={onInputChange} />
          <select name="grade" value={course.grade} aria-label="Grade" onChange={onInputChange}>
            <option disabled value="">Grade</option>
            {getGrades()}
          </select>
          <input name="points" value={course.points} placeholder="Points" type="number" min="0" onChange={onInputChange} onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
          }}} />
        </fieldset>
        <button className="formDeleteButton outline secondary" onClick={() => deleteCallback(course.id)}>🗑</button>
      </div>
    </form>
  )
}