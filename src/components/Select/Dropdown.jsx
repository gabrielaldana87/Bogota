import React, { useState, useEffect } from 'react';
import { createMap, updateMap } from '../Charts/D3/helpers';
import { options } from '../../assets/cityOptions.json';
import { useDispatch, connect } from 'react-redux';
import Select from 'react-select';
import './Dropdown.css';

const Dropdown = props => {
  const
    { dispatch }  = props,
    [ city, setCity ] = useState(null),
    onClick = option => {
      setCity(option);
      dispatch.cities.changeCity(option);
    }
  ;
  useEffect(() => {
    createMap( { id: 'city-container', ...city });
  },[])
  ;
  return (
    <div className='dropdown-div'>
      <Select
        classNamePrefix='inner-divs'
        options={ options }
        onChange={ onClick }
      />
    </div>
  )
}

const mapStateToProps = () => (
    dispatch => ({
        estratosDispatch: dispatch.estratos,
        citiesDispatch: dispatch.cities
    })
)

export default connect(mapStateToProps)(Dropdown);
