import { getEstratos } from '../api';
import {createSelector} from "@rematch/select";
import * as topojson from 'topojson';
import _ from 'underscore';

const initialState = {
    isLoading: true,
    estratos: [],
    polygonName: 'MARIA CRISTINA',
    neighborhoodPolygon: {
        coordinates: [],
    }
}

export const estratos = ({
    state: initialState,
    reducers: {
        setEstratosData(state, estratos) {
            return {
                ...state,
                geography: estratos,
                isLoading: false
            }
        },
        setSectorPolygon(state, polygonObj ) {
            const { neighborhood, polygonName } = polygonObj;
            return {
                ...state,
                polygonName : polygonName,
                neighborhoodPolygon: neighborhood,
                isLoading: false
            }

        }
    },
    effects: {
        async loadEstratosData() {
            const estratosList = await getEstratos();
            this.setEstratosData(estratosList);
        },
        async extractSector(neighborhoodObj, state) {
            const { filter, sector } = neighborhoodObj;
            const neighborhood = await filter(state?.estratos?.geography?.estratos, sector);
            this.setSectorPolygon({ polygonName: sector, neighborhood });
        }
    },
    selectors: () => ({
        geographyFilter() {
            return (geography, sector) => topojson.merge(
                geography,
                geography?.objects?.EstratosBogota?.geometries.filter(d => d.properties.SectCatast === sector && d.properties.Localidad == 'CHAPINERO')
            );
        },
        estratoValueFilter() {
            return (geography) => geography?.objects?.EstratosBogota?.geometries.filter(d => d.properties.Estrato === 6)
        }
    })
})
