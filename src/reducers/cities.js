const initialState = {
  city: {
    value: "Bogota", label: "Bogotá", key: 'Estrato'
  },
  isLoading: true
}

export const cities = ({
  state: initialState,
  reducers: {
    setCity(state, city) {
      return {
        ...state,
        ...city,
        isLoading: false
      }
    }
  },
  effects: {
    changeCity(city) {
      this.setCity({ ...city });
    }
  }
})
