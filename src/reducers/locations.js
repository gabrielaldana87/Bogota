import { getLocationCategories, getLocations } from '../api';

const initialState = {
    isLoading: true,
    categories: [],
    points: []
}

export const locations = ({
    state: initialState,
    reducers: {
        setLocationCategories(state, categories) {
            return {
                ...state,
                dropdownOptions: categories.categories,
                ...categories,
                isLoading: false
            }
        },
        setBogotaLocations(state, locations) {
            return {
                ...state,
                ...locations,
                isLoading: false
            }
        },
        setLocationSelections(state, values) {
            return {
                ...state,
                categories: values,
                isLoading: false,
            }
        }
    },
    effects: {
        async loadLocationCategories() {
            const locationsList = await getLocationCategories();
            this.setLocationCategories(locationsList);
        },
        async loadBogotaLocations() {
            const locationsList = await getLocations();
            this.setBogotaLocations(locationsList);
        },
        onValueChange(values) {
            this.setLocationSelections(values);
        }
    }
})

