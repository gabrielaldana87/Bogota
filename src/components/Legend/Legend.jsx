import React from 'react';
import { estratos } from '../../assets/estratos.json';
import './Legend.css';

const Legend = () => {
  return (
    <div className='legend-container'>
      <h6>Estratos:</h6>
      { estratos.map((o,i) => {
        return <div className='tile-container'>
          <svg
          className='svg-color'
          width={ 30 }
          height={ 30 }
          style={{ background: o.color }}
          ></svg>
          <h6>{ o.estrato_no }</h6>
        </div>
        })
      }
    </div>
  )
}

export default Legend;
