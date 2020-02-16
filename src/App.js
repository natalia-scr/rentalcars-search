import React, {useState, useEffect} from 'react';
import './App.scss';
const baseUrl = 'https://api.codetabs.com/v1/proxy?quest=';
const searchResultsNumber = 6;

function App() {
  return (
    <div className="main">
      <div className="hero-background"></div>
        <div className="searchbox-wrapper">
          <SearchBox />
        </div>
    </div>
  );
}


const SearchBox = () => {

const [query, setQuery] = useState("");
const [results, setResults] = useState([]);

useEffect(() => {
  if(query.length < 2) {
      setResults([])

  } else {
    async function fetchResults () {
      const encodedURL = encodeURIComponent(`https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=${searchResultsNumber}&solrTerm=${query}`)
        const response = await fetch(`${baseUrl}${encodedURL}`);
        const json =  await response.json();

        if(json.results.numFound === 0) {
          setResults(['none'])
        } else {
          setResults(json.results.docs);
        }
    }
    fetchResults()
  }
  
}, [query])

  return (
    <div className="searchbox">
      <h2 className="searchbox__title">Let’s find your ideal car</h2>
      <form className="searchbox__form">
        <label htmlFor="searchbox-input" className="searchbox__label">Pick-up Location</label>
        <input type="text"
              name="searchbox-input"
              id="searchbox-input"
              className="searchbox__input"
              value={query}
              onChange={event => setQuery(event.target.value)} 
              placeholder="city, airport, station, region, district..." 
              aria-required="true"
          />
        <div className="search-results" data-testid="search-results">
          { results && results.map((item, i)=> {
              return <div key={i}>{item.name}</div>
            })}
          { results[0] === 'none' && <div>No results found</div> }
        </div>
      </form>
    </div>
  )
}

export default App;
