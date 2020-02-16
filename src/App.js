import React from 'react';
import './App.scss';
import { useFetchResults } from './useFetchResults'

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

const [query, setQuery, results] = useFetchResults();

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
