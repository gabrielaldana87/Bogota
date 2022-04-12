import axios from 'axios';

const GET_HOME_LISTINGS = 'GET_HOME_LISTINGS';

const requestAirBnb = () => ({
   method: 'GET',
   url: './assets/airbnb.json'
});

const requestEstratosFile = () => ({
   method: 'GET',
   url: './assets/EstratosBogota2.topojson'
});

const requestLocationCategoriesFile = () => ({
   method: 'GET',
   url: './assets/locationCategories.json'
});

const requestLocations = () => ({
    method: 'GET',
    url: './assets/bogotaLocations.json'
})

export const getEstratos = () => {
    const url = requestEstratosFile();
    return axios(url)
        .then(res => res.data )
        .then(estratos => ({ estratos: estratos }))
    ;
}

export const getListings = () => {
    const url = requestAirBnb();
    return axios(url)
        .then(res => res.data )
        .then(listings => listings )
    ;
}

export const getLocationCategories = () => {
    const url = requestLocationCategoriesFile();
    return axios(url)
        .then(res => res.data )
        .then(categories => categories )
    ;
}

export const getLocations = () => {
    const url = requestLocations();
    return axios(url)
        .then(res => res.data )
        .then(locations => locations )
    ;
}
