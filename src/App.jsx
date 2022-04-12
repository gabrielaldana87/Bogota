import React, {useState} from 'react';
import { Provider } from 'react-redux';
import Main from './components/Main/Main';
import { store } from '../src/rematch/store';
import Title from './components/Title/Title';
import Cards from './components/Cards/Cards';
import Legend from './components/Legend/Legend';
import { options } from './assets/sectCatast.json';
import Dropdown from './components/Select/Dropdown';
import Concept from './components/Concept/Concept';
import DropdownSector from './components/Select/DropdownSector';
import DropdownLocations from './components/Select/DropdownLocations';
import './App.css';




const App = () => {
  const
    [ selection, setSelection ] = useState('locations'),
    onClick = evt => {
      setSelection(evt.target?.innerText?.toLowerCase());
    }
  ;
  return   (
    <Provider store={ store }>
      <div className='main-page'>
        <Title>Estratos de Ciudades Colombianas</Title>
        <Concept onClick={ onClick } selection={ selection }/>
        { selection === 'locations' && <DropdownLocations/> }
        { selection === 'neighborhood' && <DropdownSector/> }
        <Legend/>
        <Main id='city-container' options={ options }/>
        <Cards/>
      </div>
    </Provider>
  )
}




export default App;
