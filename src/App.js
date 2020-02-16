import React from 'react';
import './App.scss';

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

  return (
    <div className="searchbox">
      <h2 className="searchbox__title">Let’s find your ideal car</h2>
      <form className="searchbox__form">
        <label htmlFor="searchbox-input" className="searchbox__label">Pick-up Location</label>
        <input type="text"
              name="searchbox-input"
              id="searchbox-input"
              className="searchbox__input"
              value=""
              onChange={()=>{}}
              placeholder="city, airport, station, region, district..." 
              aria-required="true"/>
        <div className="search-results">
          
        </div>
      </form>
      
    </div>
  )
}

export default App;
