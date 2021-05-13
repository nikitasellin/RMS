import React, {
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';


// @TODO! Legacy, change to async react-select in forms.
const CityField = forwardRef((props, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);

  const getCities = useCallback((searchQuery) => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/v1/search/city/?search=${searchQuery}`)
      .then(resp => resp.json())
      .then(json => {
        setCityOptions(json.results);
        setLoading(false);
    })
  }, [])

  return(
    <AsyncTypeahead
      ref={ref}
      id='city'
      isLoading={loading}
      labelKey={option => `${option.alternate_names}`}
      onInputChange={(query) => { setSearchQuery(query); }}
      onChange={([query]) => { setSearchQuery(query); }}
      onSearch={getCities}
      options={cityOptions}
    />
  );
})


export default CityField;
