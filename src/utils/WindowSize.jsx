import React, { useState , useEffect } from 'react';
import debounce from 'lodash/debounce';

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        windowWidth : width,
        windowHeight : height
    }
};

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        };
        window.addEventListener('resize', handleResize );
        return () => window.removeEventListener('resize', handleResize );
    }, [])
    ;
    return windowDimensions;
};

export const useDivDimensions = (myRef, delay = 5000) => {

    const
        getDimensions = () => ({
            width: myRef.current?.offsetWidth,
            height: myRef.current?.offsetHeight,
        }),
        [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    ;
    useEffect( () => {
        const
            handleResize = () => setDimensions(getDimensions()),
            debounceHandleResize = debounce(handleResize, delay)
        ;
        if (myRef.current) setDimensions(getDimensions());
        window.addEventListener('resize', debounceHandleResize);
        return () => {
            window.removeEventListener('resize', debounceHandleResize);
        }
    }, [myRef, delay]);
    return dimensions;
};
