import React from 'react';
import './Card.css';

const Card = props => {
    const { name, stars, photos } = props;
    return (
        <div className='card'>
            <img src={ photos[0].large } className='card-image'/>
            <div className='card-stats'>
                <img src='/stars'/>
                <span className='grey'>{ stars }</span>
                <span className='grey'></span>
                <span className='grey'></span>
            </div>
            <p>{ name }</p>
            <p><span className='bold'></span></p>
        </div>
    )
}

export default Card;
