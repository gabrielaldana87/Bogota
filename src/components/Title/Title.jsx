import React, { useState } from 'react';
import { connect } from 'react-redux';
import './Title.css';

const Title = props => {
  const { city } = props;
    return (<div className='container title-container'>
        <h1>Estratos de Ciudades Colombianas</h1>
        <div className='city-name'>
            <h2>{ city }</h2>
        </div>
    </div>)
}

const mapStateToProps = state => ({
  city: state.cities.value
})

export default connect(mapStateToProps)(Title);
