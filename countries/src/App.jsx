import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const CountryShow = ({countrySearch, countryList}) =>{
	if(countryList.length > 0){
		let countryToShow = countryList.filter(item => item.name.common.toLowerCase().includes(countrySearch.toLowerCase()))
		console.log(countryToShow);
		if(countryToShow.length == 1){
			const country = countryToShow[0];
			console.log(country);
			return(
				<div>
					<h1>{country.name.common}</h1>
					<div>capital: {country.capital} </div>
					<div>area {country.area}</div>
					<div>languages {Object.entries(country.languages).map(([key,value])=>(
						<div key={key}>{value}</div>
					))}</div>
					<div>{country.flag}</div>
				</div>
			)
		}
		else if(countryToShow.length > 10){
			return (
				<div>
					Too many matches, specify another filter
				</div>
			)
		}
		else if(countryToShow.length > 1 && countryToShow.length < 10){
			return (
				<div>
					{countryToShow.map(country =>(
						<div key={country.cca2}>{country.name.common}</div>
					))}
				</div>
			)
		}
		
		else if(countryToShow.length < 1){
			return (
				<div>No result</div>
			)
		}
	}

}

const App = () => {
	const [countrySearch, setCountrySearch] = useState('');
	const [countryList, setCountryList] = useState([]);


	useEffect(() =>{
		console.log('effect');
		
		axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
			.then(response => setCountryList(response.data))
	},[])

	const handleFilterChange = (event) => {
		setCountrySearch(event.target.value);
	}

	// console.log(countryList[0])



	return (
		<div>
			find countries <input value={countrySearch} onChange={handleFilterChange}/>
			<CountryShow countrySearch={countrySearch} countryList={countryList} />
			
		</div>
	)
}

export default App
