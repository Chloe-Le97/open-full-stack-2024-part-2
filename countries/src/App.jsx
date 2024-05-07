import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const api_key = import.meta.env.VITE_SOME_KEY
// variable api_key now has the value set in startup

const SingleCountry = ({name,capital,area,languages,flag,location}) =>{
	const [weather, setWeather] = useState([]);

	const lat = location[0];
	const lon = location[1];

	console.log(api_key);

	useEffect(()=>{
		axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
			.then(response =>{
				
				setWeather(response.data)
			})
	},[])

	return(
		<div>
			<h1>{name}</h1>
			<div>capital: {capital} </div>
			<div>area {area}</div>
			<div>languages {Object.entries(languages).map(([key,value])=>(
				<div key={key}>{value}</div>
			))}</div>
			<div>{flag}</div>
			{weather.main?(<div>
				<h3>Weather in {capital}</h3>
				<div>{weather.weather[0].main}</div>
				<img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
				<div>temperature {weather.main.temp} Celcius</div>
				<div>wind {weather.wind.speed} m/s</div>
			</div>)
			:(<div>

			</div>)}
		</div>
	)
}

const CountryShow = ({countrySearch, countryList,setCountrySearch}) =>{


	const showCountry = (country) =>{
		console.log(country);
		setCountrySearch(country.name.common);
		
	}

	if(countryList.length > 0){
		let countryToShow = countryList.filter(item => item.name.common.toLowerCase().includes(countrySearch.toLowerCase()))

		if(countryToShow.length == 1){
			const country = countryToShow[0];
			console.log(country);
			return(
				<SingleCountry name={country.name.common} capital={country.capital} area={country.area} languages={country.languages} flag={country.flag} location={country.latlng} />
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
						<div key={country.cca2}>
							{country.name.common}
							<button onClick={()=>showCountry(country)}>show</button>
						</div>
					))}
				</div>
			)
		}
		
		else if(countryToShow.length < 1){
			return (
				<div>No result</div>
			)
		}
		else if(countryClicked.keys(obj).length > 0){
			<SingleCountry name={countryClicked.name.common} capital={countryClicked.capital} area={countryClicked.area} languages={countryClicked.languages} flag={countryClicked.flag} />
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
			<CountryShow countrySearch={countrySearch} countryList={countryList} setCountrySearch={setCountrySearch} />
			
		</div>
	)
}

export default App
