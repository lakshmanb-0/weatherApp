import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    previousLocations: [] as previousLocations[],
    units: 'metric',
    tableData: []
}

export type previousLocations = {
    lat: number,
    lon: number,
    cityName: string,
    country: string,
    favorite: boolean,
    temp: number,
    weatherDescription: string
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUnits: (state, action) => {
            state.units = action.payload;
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        addLocalStorage: (state) => {
            state.previousLocations = JSON.parse(localStorage.getItem('previousLocations')!)
        },
        addPreviousLocation: (state, action: { payload: previousLocations }) => {
            const newLocation = action.payload;
            const existingLocation = state.previousLocations?.find(location => (location.lat === newLocation.lat && location.lon === newLocation.lon) || location.cityName === newLocation.cityName);

            const updatedLocations = [
                {
                    ...newLocation,
                    favorite: existingLocation?.favorite ?? false
                },
                ...(state.previousLocations?.filter(location => location.lat !== newLocation.lat && location.lon !== newLocation.lon && location.cityName !== newLocation.cityName) || [])
            ];

            let favorite = updatedLocations.filter(location => location.favorite);
            let recent = updatedLocations.filter(location => !location.favorite);
            const limitedRecent = recent.slice(0, 5);

            state.previousLocations = [...favorite, ...limitedRecent];
            localStorage.setItem('previousLocations', JSON.stringify(state.previousLocations));
        },
        toggleFavoriteLocation: (state, action) => {
            state.previousLocations = state.previousLocations.map(location => {
                if (location.lat === action.payload.lat && location.lon === action.payload.lon) {
                    location.favorite = !location.favorite;
                }
                return location;
            });
            localStorage.setItem('previousLocations', JSON.stringify(state.previousLocations));
        },
    }
})

export const { setUnits, addPreviousLocation, toggleFavoriteLocation, addLocalStorage, setTableData } = dataSlice.actions
export default dataSlice.reducer