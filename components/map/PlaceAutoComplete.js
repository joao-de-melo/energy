"use client";

import {useEffect, useRef, useState} from "react";
import {useMapsLibrary} from "@vis.gl/react-google-maps";

export const PlaceAutocomplete = ({onPlaceSelect}) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address']
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <div className="autocomplete-container" style={{marginTop: "10px", width: "600px"}}>
            <input ref={inputRef} className="form-control" />
        </div>
    );
};

export default PlaceAutocomplete;