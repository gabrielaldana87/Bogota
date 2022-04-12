import React, { useState } from 'react';

const Title = () => {
    const [city, setCity] = useState('Bogota')

    return (<>
        <h1>Estratos de Ciudades Colombianas</h1>
        <h2>{ city }</h2>
    </>)
}

export default Title;
