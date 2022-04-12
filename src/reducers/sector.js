const initialState = {
    sector: 'BELLAVISTA',
    isLoading: true,
}

export const sector = ({
    state: initialState,
    reducers: {
        setSector(state, sector) {
            // console.log(sector)
            return {
                ...state,
                ...sector,
                isLoading: false
            }
        }
    },
    effects: {
        changeSector(sector) {
            this.setSector({ sector: sector.value });
        }
    }
})
