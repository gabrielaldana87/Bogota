import Select from 'react-select';
import { select } from '../../rematch/store';
import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { changeSector } from '../Charts/D3/helpers';
import { options } from '../../assets/sectCatast.json';

const DropdownSector = props => {
    const
        { citiesDispatch, neighborhoodDispatch, estratosDispatch, estratosSelect } = props,
        { city } = citiesDispatch,
        { isLoading } = neighborhoodDispatch,
        { neighborhoodPolygon, polygonName } = estratosDispatch,
        { coordinates } = neighborhoodPolygon,
        [ sector, setSector ] = useState(null),
        dispatch = useDispatch(),
        onClick = option => {
            // setSector({ sector: option.value });
            dispatch.sector.changeSector(option);
        }
    ;
    useEffect(() => {
        const neighborhoodFilter = estratosSelect.geographyFilter;
        if (!isLoading)  {
            dispatch.estratos.extractSector({ sector: neighborhoodDispatch.sector, filter: neighborhoodFilter });
        }
    },[ neighborhoodDispatch.sector ])
    ;
    useEffect(() => {
        if (neighborhoodPolygon.coordinates.length > 0 && !estratosDispatch.isLoading) {
            changeSector({
                id: 'city-container',
                ...neighborhoodDispatch,
                value: citiesDispatch.city.value,
                neighborhood: neighborhoodPolygon
            });
        }
    }, [ estratosDispatch.polygonName ])
    ;
    return (
        <div className='dropdown-div'>
            <Select
                // isMulti
                // defaultValue={[{ value: 'GRANADA', label:'GRANADA'}]}
                classNamePrefix='inner-divs'
                options={ options }
                onChange={ onClick }
            />
        </div>
    )
}

const mapStateToProps = () => (
    dispatch => ({
        citiesDispatch: dispatch.cities,
        neighborhoodDispatch: dispatch.sector,
        estratosDispatch: dispatch.estratos,
        estratosSelect: select.estratos
    })
)

export default connect(mapStateToProps)(DropdownSector);
