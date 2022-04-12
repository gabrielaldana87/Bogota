import React, { useEffect } from 'react';
import { select } from '../../rematch/store';
import { connect } from 'react-redux';
import Card from './Card';
import './Cards.css';

const Cards = props => {
    const
        { dispatch, homesDispatch, estratosDispatch, homesSelect } = props,
        { listings, isLoading } = homesDispatch
    ;
    useEffect(() => {
        const pointInPolygonFilter = homesSelect.pointInPolygonFilter;
        if (!estratosDispatch.isLoading) {
            dispatch.homes.loadListingData(pointInPolygonFilter);
        }
    },[estratosDispatch.neighborhoodPolygon])
    ;
    return <div className='container cards-container'>{listings.map( o =>  {
        return !isLoading && <Card {...o } />
    }) }</div>
}

const mapStateToProps = () => (
    dispatch => ({
        homesDispatch: dispatch.homes,
        estratosDispatch: dispatch.estratos,
        homesSelect: select.homes
    })
);

export default connect(mapStateToProps)(Cards);
