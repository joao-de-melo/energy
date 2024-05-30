import {Marker} from "@vis.gl/react-google-maps";

const MapMarker = ({position, onDragPosition}) => {
    return <Marker position={position} draggable={true} onDragEnd={e => {
        let newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };
        onDragPosition(newPos)
    }}></Marker>
};

export default MapMarker;