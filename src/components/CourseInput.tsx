import {type Course, Grades} from "../DataClasses.ts";
import {useCallback} from "react";
import * as React from "react";

export default function CourseInput({ course, deleteCallback, handleChange }: {
  course: Course,
  deleteCallback: (courseId: string) => void,
  handleChange: (courseId: string,
    eventName: string,
    value: string | number) => void }
) {
  const [gradeIsValid, setGradeIsValid] = React.useState(course.grade !== '');
  const [pointsIsValid, setPointsIsValid] = React.useState(Number(course.points) > 0);

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
    handleChange(course.id, e.target.name, (e.target.name == "points" ? Number(e.target.value) : e.target.value));
  }, [handleChange, course]);

  return (
    <form>
      <div className="courseForm">
        <fieldset className="grid courseInput">
          <input name="name" value={course.name} placeholder="Course Name" aria-label="Course Name" onChange={onInputChange} />
          <select required
                  name="grade"
                  className="courseInputField"
                  value={course.grade}
                  aria-label="Grade"
                  aria-invalid={!gradeIsValid}
                  onChange={(e) => {
                    onInputChange(e)
                    setGradeIsValid(e.target.value !== '')
                  }}>
            <option disabled value="">Grade</option>
            {getGrades()}
          </select>
          <input required
                 name="points"
                 className="courseInputField"
                 value={course.points}
                 placeholder="Points"
                 type="tel"
                 aria-invalid={!pointsIsValid}
                 onChange={(e) => {
                   onInputChange(e)
                   setPointsIsValid(Number(e.target.value) > 0)
                  }}
                 onKeyPress={(event) => {
                   if (!/[0-9]/.test(event.key)) {
                     event.preventDefault();
                   }
                 }} />
        </fieldset>
        <button className="formDeleteButton outline secondary" onClick={() => deleteCallback(course.id)}>🗑</button>
      </div>
    </form>
  )
}