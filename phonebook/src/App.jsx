import { useState, useEffect } from 'react';
import axios from 'axios';
import personService from './services/persons';
import './App.css';

const Filter = ({filter,handleFilterChange}) =>{
  return(
    <div>
    filter shown with <input value={filter} onChange={handleFilterChange}/>
  </div>
  )
}

const PersonForm = ({addNewPerson,newName,newNumber,handleNameChange,handleNumberChange}) =>{
  return(
    <form onSubmit={addNewPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({name,phone,remove}) =>{
  return(
    <div>
		{name} {phone}
		<button onClick={remove}>Deleter person</button>
	</div>
  )
}

const Notification = ({ message }) => {
	if (message === null) {
	  return null
	}
  
	return (
	  <div className='error'>
		{message}
	  </div>
	)
  }

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() =>{
    console.log('effect');
	personService.getAll().then(person =>{
		setPersons(person)
	})
  },[])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const addNewPerson = (event) => {
    event.preventDefault();
    const personExists = persons.find(person => person.name === newName);
    if(personExists){
		
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
		const personExistsID = personExists.id;
		const updatedPerson = {...personExists,number:newNumber}

		personService.update(personExistsID,updatedPerson).then(returnedPerson =>{
			const newPersons = persons.map((person) => person.id !== returnedPerson.id? person:returnedPerson);
			setPersons(newPersons);
			setNewName('')
			setNewNumber('');
			setErrorMessage(
				`${returnedPerson.name}'s phone number was updated`
			  )
			  setTimeout(() => {
				setErrorMessage(null)
			  }, 5000)
		}).catch(error =>{
			setErrorMessage(
				`${newName} has already been removed and not in server`
			  )
			  setTimeout(() => {
				setErrorMessage(null)
			  }, 5000)
		})
	  }else{
		return
	  }
      
    }else{
		const newPerson ={
			name: newName,
			number: newNumber
		  }
		  personService.create(newPerson).then(returnedPerson =>{
				  setPersons(persons.concat(returnedPerson))
				  setNewName('')
				  setNewNumber('')
				  setErrorMessage(
					`${returnedPerson.name} was added`
				  )
				  setTimeout(() => {
					setErrorMessage(null)
				  }, 5000)
		  })
	}
  
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) =>{
    setFilter(event.target.value);
  }

  const personToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const removePerson = (id) =>{
	const personNeedToRemove = persons.find(person => person.id === id );
	if(confirm(`Do you really want to delete ${personNeedToRemove.name}?`)){
		personService
			.remove(id)
			.then(returnedPerson=>{
				console.log(returnedPerson.id)
				const filteredPersons = persons.filter(person => person.id !== returnedPerson.id);
				setPersons(filteredPersons);
				setErrorMessage(
					`${personNeedToRemove.name} was removed from server`
				  )
				  setTimeout(() => {
					setErrorMessage(null)
				  }, 5000)
			}).catch(error =>{
				setErrorMessage(
					`${personNeedToRemove.name} has already been removed not in server`
				  )
				  setTimeout(() => {
					setErrorMessage(null)
				  }, 5000)
			})
	}
  }

  return (
    <div>
      <h2>Phonebook</h2>
	  <Notification message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new person</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNumberChange={handleNumberChange}  addNewPerson={addNewPerson} handleNameChange={handleNameChange} />
     
      <h2>Numbers</h2>
	  <div>
		{personToShow.map(person =>
			<Person 
				key={person.id} name={person.name} phone={person.number} remove={() => removePerson(person.id)}/>)}
	  </div>
      
    </div>
  )
}

export default App