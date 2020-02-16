import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
const baseUrl = 'https://api.codetabs.com/v1/proxy?quest=';
const searchResultsNumber = 6;

export const useFetchResults = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setIsLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 300);
  
    useEffect(() => {
        
        if (debouncedQuery && debouncedQuery.length >= 2) {

            async function fetchResults () {
                setIsLoading(true);
                const encodedURL = encodeURIComponent(`https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=${searchResultsNumber}&solrTerm=${debouncedQuery}`)
                const response = await fetch(`${baseUrl}${encodedURL}`);
                const json =  await response.json();

                setIsLoading(false);
                setResults(json.results.numFound === 0 ? [{name: 'No results found'}] : json.results.docs)
            }
        fetchResults()
        
        } else {
            setResults([])
        }
      
    }, [debouncedQuery])
  
    return [query, setQuery, results, loading]

  }