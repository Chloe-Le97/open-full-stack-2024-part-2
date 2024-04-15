const Course = ({course}) =>{
    return (
          <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts}/>
          </div>
        )
  }
  
  const Header = ({name}) => {
    return (
      <h1>{name}</h1>
    )
  }
  
  const Part = ({partName,exercises}) => {
    return (
      <div>
        {partName} {exercises}
      </div>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
       {parts.map(part => (
        <Part key={part.id} partName={part.name} exercises={part.exercises}></Part>
       ))}
      </div>
    )
  }
  
  const Total = ({parts}) =>{
   
    return(
      <div>
        Total of {parts.reduce(function (acc, obj) { return acc + obj.exercises; }, 0)} exercises
      </div>
    )
  }

  export default Course;