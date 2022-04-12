import React, { useState, useEffect } from 'react';
import useWindowDimensions from '../utils/WindowSize';
import { createMap } from './Charts/D3/helpers';
import { connect } from 'react-redux';
import Cards from '../components/Cards/Cards';

import { options } from '../assets/cityOptions.json'

const Cartography = props => {
  const
      { id, citiesDispatch, sectorDispatch } = props,
      { windowWidth } = useWindowDimensions(),
      { sector } = sectorDispatch,
      svgDimension = { width: windowWidth * .67, height: 1000 },
      { city } = citiesDispatch
     // city = options[0]
  ;
  useEffect(() => {
     createMap( { id, ...city, sector, ...svgDimension } );
  },[])
  ;
  return (
     <div id={ id }>
         <svg width={ windowWidth * .67 } height={ 1000 }>
             <g></g>
         </svg>
         <div width={ 250 } >
            <Cards/>
         </div>
     </div>
  )
}

const mapStateToProps = () => (
    dispatch => ({
        citiesDispatch: dispatch.cities,
        sectorDispatch: dispatch.sector
    })
)

export default connect(mapStateToProps)(Cartography);
