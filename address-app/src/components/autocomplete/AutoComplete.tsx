import { useState, useEffect } from "react";
import { AutoCompleteTextBox } from "./AutoCompleteTextBox";
import { GetCities, GetPostalCodes, GetStreets } from "../../services/NormalizationApi";

export interface AutoCompleteState {
    selectedCity: string;
    selectedStreet: string;
    selectedPostalCode: string;
    cityOptions: string[];
    streetOptions: string[];
    postalCodeOptions: string[];
}

export const AutoComplete = () => {
    const [autoCompleteState, setAutoCompleteState] = useState<AutoCompleteState>({
        selectedCity: "",
        selectedStreet: "",
        selectedPostalCode: "",
        cityOptions: [],
        streetOptions: [],
        postalCodeOptions: [],
    });
    // 🔹 Debounce helper
    const useDebounce = (value: string, delay: number) => {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    };

    // Debounced values
    const debouncedCity = useDebounce(autoCompleteState.selectedCity, 300);
    const debouncedStreet = useDebounce(autoCompleteState.selectedStreet, 300);
    const debouncedPostalCode = useDebounce(autoCompleteState.selectedPostalCode, 300);

    // 🔹 API calls triggered po debounce
    useEffect(() => {
        const fetchCities = async () => {
            if (debouncedCity.length >= 3 || debouncedStreet || debouncedPostalCode) {
                const filtered = await GetCities(debouncedCity, autoCompleteState.selectedPostalCode);
                setAutoCompleteState(prev => ({ ...prev, cityOptions: filtered }));
            } else {
                setAutoCompleteState(prev => ({ ...prev, cityOptions: [] }));
            }
        };
        fetchCities();
    }, [debouncedCity]);

    useEffect(() => {
        const fetchStreets = async () => {
            if (debouncedStreet.length >= 3 || debouncedPostalCode || debouncedCity) {
                const filtered = await GetStreets(autoCompleteState.selectedCity, debouncedStreet, autoCompleteState.selectedPostalCode);
                setAutoCompleteState(prev => ({ ...prev, streetOptions: filtered }));
            } else {
                setAutoCompleteState(prev => ({ ...prev, streetOptions: [] }));
            }
        };
        fetchStreets();
    }, [debouncedStreet]);

    useEffect(() => {
        const fetchPostalCodes = async () => {
            if (debouncedPostalCode.length >= 3 || debouncedStreet || debouncedCity) {
                const filtered = await GetPostalCodes(autoCompleteState.selectedCity, autoCompleteState.selectedStreet, debouncedPostalCode);
                setAutoCompleteState(prev => ({ ...prev, postalCodeOptions: filtered }));
            } else {
                setAutoCompleteState(prev => ({ ...prev, postalCodeOptions: [] }));
            }
        };
        fetchPostalCodes();
    }, [debouncedPostalCode]);

    // 🔹 Handlery zmian
    const onCityChange = (city: string, isSelect: boolean) => {
        setAutoCompleteState(prev => ({ ...prev, selectedCity: city }));
        if (isSelect) setAutoCompleteState(prev => ({ ...prev, cityOptions: [] }));
    };

    const onStreetChange = (street: string, isSelect: boolean) => {
        setAutoCompleteState(prev => ({ ...prev, selectedStreet: street }));
        if (isSelect) setAutoCompleteState(prev => ({ ...prev, streetOptions: [] }));
    };

    const onPostalCodeChange = (postalCode: string, isSelect: boolean) => {
        setAutoCompleteState(prev => ({ ...prev, selectedPostalCode: postalCode }));
        if (isSelect) setAutoCompleteState(prev => ({ ...prev, postalCodeOptions: [] }));
    };

    return (
        <div style={{ display: "flex", gap: "16px" }}>
            <AutoCompleteTextBox
                lbl="Miasto"
                value={autoCompleteState.selectedCity}
                options={autoCompleteState.cityOptions}
                onChange={onCityChange}
            />
            <AutoCompleteTextBox
                lbl="Ulica"
                value={autoCompleteState.selectedStreet}
                options={autoCompleteState.streetOptions}
                onChange={onStreetChange}
            />
            <AutoCompleteTextBox
                lbl="Kod pocztowy"
                value={autoCompleteState.selectedPostalCode}
                options={autoCompleteState.postalCodeOptions}
                onChange={onPostalCodeChange}
            />
        </div>
    );
};