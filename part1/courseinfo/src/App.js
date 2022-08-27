const Header = (props) => (
  <h1>{props.course.name}</h1>
)

const Part = (props) => (
  <p>{props.name} {props.exercises}</p>
)

const Content = (props) => (
  props.course.parts.map(element => {
    return <Part name={element.name} exercises={element.exercises}/>
  })
)

const Total = (props) => {
  let total = 0
  props.course.parts.forEach(part => {
    total = total + part.exercises
  });

  return (
    <p>Number of exercises {total}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App