import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { addSubunits } from '../Charts/D3/helpers';
import './Concept.css';

const Concept = props => {
    const
        { onClick, selection, estratosDispatch, sectorDispatch } = props,
        { isLoading, geography, neighborhoodPolygon } = estratosDispatch,
        { sector } = sectorDispatch
    ;
    useEffect(() => {
        if( selection == 'neighborhood') {
            !isLoading && addSubunits({
                id : 'city-container',
                ...geography,
                sector: sector,
                neighborhood: neighborhoodPolygon
            })
        }
    },[selection])
    ;
    return (
        <div className='container concept-container'>
            <div
                className={ ['div-buttons', selection == 'locations' ? 'selected' : '' ].join(' ') }
                onClick={evt => onClick(evt) }
            >
                <button className={ ['buttons', selection == 'locations' ? 'selected' : '', 'button-loc'].join(' ') }>
                    Locations
                </button>
            </div>
            <div className={ ['div-buttons', selection == 'neighborhood' ? 'selected' : '' ].join(' ') }
                 onClick={evt => onClick(evt) }
            >
                <button className={ ['buttons', selection == 'neighborhood' ? 'selected' : '', 'button-hood'].join(' ') }>
                    Neighborhood
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = () => (
    dispatch => ({
        estratosDispatch: dispatch.estratos,
        sectorDispatch: dispatch.sector
    })
)

export default connect(mapStateToProps)(Concept);
