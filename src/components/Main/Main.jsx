import React, { useRef, useEffect } from 'react';
import { useDivDimensions } from '../../utils/WindowSize';
import { createMap } from '../Charts/D3/helpers';
import { select } from '../../rematch/store';
import { connect } from 'react-redux';
import _ from 'underscore';
import './Main.css';
import { options } from '../../assets/cityOptions.json'

const Main = props => {
  const
      {
          id,
          dispatch,
          citiesDispatch,
          sectorDispatch,
          estratosSelect,
          estratosDispatch,
          locationsDispatch,
          homesDispatch
      } = props,
      containerRef = useRef(),
      { width, height } = useDivDimensions(containerRef),
      { sector } = sectorDispatch,
      { city } = citiesDispatch,
      { points } = locationsDispatch,
      { geography, isLoading, neighborhoodPolygon } = estratosDispatch
     // city = options[0]
  ;
  useEffect(() => {
      dispatch.estratos.loadEstratosData();
  },[])
  ;
  useEffect(() => {
      const neighborhoodFilter = estratosSelect.geographyFilter;
      const testFilter = estratosSelect.estratoValueFilter;
      // console.log(_.uniq(testFilter(geography?.estratos), d => d.properties.SectCatast).map( d => d.properties.SectCatast ))

      if (!isLoading) dispatch.estratos.extractSector({ sector : sector, filter: neighborhoodFilter });
  },[!isLoading])
  ;
  useEffect(() => {
      !locationsDispatch.isLoading && createMap( {
          id,
          ...city,
          sector,
          width: width,
          height: height,
          ...geography,
          neighborhood: neighborhoodPolygon,
          ...homesDispatch,
          points: points
      } );
  },[ estratosDispatch.neighborhoodPolygon && !homesDispatch.isLoading ])
  ;
  return (
     <div id={ id } ref={ containerRef }>
         <svg width={ width } height={ height }>
             <g
                 width={ width }
                 height={ height }
             ></g>
         </svg>
     </div>
  )
}

const mapStateToProps = () => (
    dispatch => {
        return {
            citiesDispatch: dispatch.cities,
            sectorDispatch: dispatch.sector,
            estratosDispatch: dispatch.estratos,
            locationsDispatch: dispatch.locations,
            estratosSelect: select.estratos,
            homesDispatch: dispatch.homes
        }
    }
)

export default connect(mapStateToProps)(Main);
