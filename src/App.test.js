import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('given I am a visitor on rentalcars.com homepage', () => {

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
  
});

