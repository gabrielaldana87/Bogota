import { getListings } from '../api';
import * as d3 from "d3";

const initialState = {
    isLoading: true,
    listings: []
}

export const homes = ({
    state: initialState,
    reducers: {
        setListingData(state, homesList) {
            return {
                ...state,
                ...homesList,
                isLoading: false
            }
        }
    },
    effects: {
        async loadListingData(filter, state) {
            const homesList = await getListings();
            const neighborhood = state?.estratos?.neighborhoodPolygon;
            const filteredHomes = homesList.filter(filter(neighborhood));
            this.setListingData({ listings: filteredHomes })
        }
    },
    selectors: () => ({
        pointInPolygonFilter() {
            return neighborhood => d =>
                d3.geoContains(neighborhood,  [d.location.lng, d.location.lat]);
        }

    })
})
