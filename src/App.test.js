import React from 'react';
import { render, fireEvent, waitForElement, wait, act } from '@testing-library/react';
import App from './App';

const nock = require('nock')

const mockFetch = (searchTerm) => {
  const encodedURL = encodeURIComponent(`https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=${searchTerm}`)

  nock('https://api.codetabs.com/v1')
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get(`/proxy?quest=${encodedURL}`)
    .reply(200, {
      "results": {
        "docs": [
          {
            "bookingId": "city-2810615",
            "name": "Searcy",
            "region": "Alabama",
          },
          {
            "bookingId": "city-2810615",
            "name": "Manchester",
            "region": "Greater Manchester", 
          }
        ]}
    })
}

describe('given I am a visitor on the search app homepage', () => {
  
  it("I should see the search box title and a text box labelled 'Pick-up Location'", () => {
    const { getByText, getByLabelText } = render(<App />);
    const searchTitle = getByText(/Let’s find your ideal car/i);
    expect(searchTitle).toBeInTheDocument();

    const inputBox = getByLabelText(/Pick-up Location/g)
    expect(inputBox).toBeInTheDocument()
  })
  
  it("On the search box I should see the placeholder text: 'city, airport, station, region and district..", () => {
    const { getByPlaceholderText } = render(<App />);
    const placeholderText = getByPlaceholderText(/city, airport, station, region, district.../g)

    expect(placeholderText).toBeInTheDocument();
  })
  
  it('When I enter a single character into the pick up location, the placeholder text disappears and no search results are displayed', () => {
    const { getByLabelText, queryByTestId } = render(<App />);
    const input = getByLabelText(/Pick-up Location/g);

    fireEvent.change(input, {target : {value : 's'}});
    expect(input.value).toBe('s')
    expect(queryByTestId("search-results")).not.toHaveTextContent()
  })

  it('When 2 or more characters into the pick up location, the search results are displayed', async () => {
    
    const searchTerm = 'manchester'
    mockFetch(searchTerm);
    
    const { getByLabelText, queryByTestId, getByText, getByAltText } = render(<App />);
    const input = getByLabelText(/Pick-up Location/g);

    fireEvent.change(input, {target : {value : searchTerm}});
    expect(input.value).toBe(searchTerm)

    await waitForElement(() =>getByAltText('spinner'))

    await waitForElement(() => getByText('Manchester'))

    expect(queryByTestId("search-results")).toHaveTextContent(/Manchester/)
    expect(queryByTestId("search-results")).toHaveTextContent(/Searcy/)
  })

  it("When I enter a search term in the pick up location that is not recognised, Then I should see the message 'No results found'", async () => {
    const searchTerm = 'wtrsetygrtjg'
    const encodedURL = encodeURIComponent(`https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm=${searchTerm}`)

    nock('https://api.codetabs.com/v1')
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get(`/proxy?quest=${encodedURL}`)
    .reply(200, {
      "results": {
        numFound: 0
      }
    })

    const { getByLabelText, queryByTestId, getByText } = render(<App />);
    const input = getByLabelText(/Pick-up Location/g);

    fireEvent.change(input, {target : {value : searchTerm}});
    expect(input.value).toBe(searchTerm)

    await waitForElement(() => getByText('No results found'))

    expect(queryByTestId("search-results")).toHaveTextContent(/No results found/)
    
  })

  it('Given a list of results is displayed, When I remove the search term leaving only 1 character, Then the search results list no longer displayed', async () => {
    
    const searchTerm = 'manchester'
    mockFetch(searchTerm);

    const { getByLabelText, queryByTestId, getByText } = render(<App />);
    const input = getByLabelText(/Pick-up Location/g);

    fireEvent.change(input, {target : {value : searchTerm}});

    expect(input.value).toBe(searchTerm)

    await waitForElement(() => getByText('Manchester'))

    expect(queryByTestId("search-results")).toHaveTextContent(/Manchester/)
    expect(queryByTestId("search-results")).toHaveTextContent(/Searcy/)

    fireEvent.change(input, {target : {value : 's'}});

    expect(input.value).toBe('s')
    expect(queryByTestId("search-results")).not.toHaveTextContent()
  })

});

describe('When I type in the search input, results should be fetched only after I stop typing', () => {
  it('should debounce', async () => {
    const searchTerm = 'London'
    mockFetch(searchTerm);
    jest.useFakeTimers()
  
    const { getByLabelText, queryByText, getByText } = render(<App />);
    const input = getByLabelText(/Pick-up Location/g);
  
    fireEvent.change(input, {target : {value : searchTerm}});
  
    await wait (() => expect(queryByText('Manchester')).not.toBeInTheDocument())
  
    await act(async() => {
      jest.advanceTimersByTime(300);
      await wait (() => expect(queryByText('Manchester')).toBeInTheDocument())
    })
  
  })
})

