'use client';

import {APIProvider, ControlPosition, Map, MapControl} from '@vis.gl/react-google-maps';
import PlaceAutocomplete from "./PlaceAutoComplete";
import {useEffect, useState} from "react";
import MapHandler from "./MapHandler";
import MapMarker from "./MapMarker";

const MapViewer = ({onChangePosition = (data) => {}}) => {
    let defaultCenter = {lat: 41.5454486, lng: -8.426506999999999};
    const [position, setPosition] = useState(null);
    const [place, setPlace] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                let newPos = {
                    lat: data.coords.latitude,
                    lng: data.coords.longitude
                };
                setPosition(newPos)
                onChangePosition(newPos)
            }, (error) => {
                setPosition(defaultCenter);
                onChangePosition(defaultCenter)
            });
        } else {
            setPosition(defaultCenter);
            onChangePosition(defaultCenter);
        }
    }, [])

    if (!position) {
        return <></>
    }

    return (
        <div style={{backgroundColor: "#CCC", height: "400px", borderRadius: "25px"}}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
                <Map defaultZoom={10}
                     mapTypeId={"hybrid"}
                     defaultCenter={position}
                     onClick={e => {
                         let newPosition = {
                             lat: e.detail.latLng.lat,
                             lng: e.detail.latLng.lng,
                         };
                         setPosition(newPosition)
                         onChangePosition(newPosition)
                     }}
                     gestureHandling={'greedy'}
                     disableDefaultUI={true}>
                    <MapControl position={ControlPosition.TOP}>
                        <PlaceAutocomplete onPlaceSelect={(data) => {
                            setPlace(data)
                            let newPosition = {
                                lat: data?.geometry?.location?.lat(),
                                lng: data?.geometry?.location?.lng(),
                            };
                            setPosition(newPosition)
                            onChangePosition(newPosition)
                        }} />
                    </MapControl>
                    <MapMarker onDragPosition={(data) => {
                        setPosition(data);
                        onChangePosition(data);
                    }} position={position} />
                    <MapHandler place={place} />
                </Map>
            </APIProvider>
        </div>
    );
};
export default MapViewer;