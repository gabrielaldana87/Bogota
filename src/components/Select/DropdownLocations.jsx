import React, { useEffect, useRef } from 'react';
import {addLocations, addSubunits, removeLocations} from '../Charts/D3/helpers';
import { connect } from 'react-redux';
import Select from 'react-select';
import chroma from 'chroma-js';

const DropdownLocations = props => {
    const
        { dispatch, locationsDispatch } = props,
        { categories, points, isLoading } = locationsDispatch,
        onChange = values => {
            dispatch.locations.onValueChange(values);
        },
        usePrevious = value => {
            const ref = useRef();
            useEffect(() => { ref.current = value }, [value]);
            return ref.current;
        },
        previousCategories = usePrevious(categories);

    useEffect(() => {
        dispatch.locations.loadLocationCategories();
        dispatch.locations.loadBogotaLocations();
    },[])
    ;
    useEffect(() => {
        let dropdown = locationsDispatch.dropdownOptions;
        let selected = dropdown?.filter(o => categories.includes(o) );
        if (!isLoading && selected?.length < previousCategories?.length ) {
            let changed = previousCategories.find(d => !selected.includes(d));
            removeLocations({
                id: 'city-container',
                categoryChange: changed
            })
            ;
        }
        if (!isLoading && selected?.length > previousCategories?.length ) {
            addLocations({
                id: 'city-container',
                categoryChange: selected.find(d => !previousCategories.includes(d) )
            })
            ;
        }
    },[categories])
    ;
    return (
        <div className='container layers-container'>
            { !isLoading && <Select
            isMulti
            options={ locationsDispatch.dropdownOptions }
            defaultValue={ categories }
            styles={ colourStyles }
            onChange={ val => onChange(val) }
            /> }
        </div>
    )
}

const colourStyles = {
        multiValue: (styles, { data }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: color.alpha(0.3).css()
            };
        }
}

const mapStateToProps = () => (
    dispatch => ({
        locationsDispatch: dispatch.locations
    })
)
export default connect(mapStateToProps)(DropdownLocations);
