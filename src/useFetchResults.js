import { useState, useEffect } from 'react';
const baseUrl = 'https://api.codetabs.com/v1/proxy?quest=';
const searchResultsNumber = 6;

export const useFetchResults = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
  
    useEffect(() => {
      if(query.length < 2) {
          setResults([])
  
        } else {
            async function fetchResults () {
                setIsLoading(true)
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
  
    return [query, setQuery, results, loading]

  }