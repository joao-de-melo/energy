import HourlyProfileChart from "./HourlyProfileChart";
import {useEffect, useState} from "react";


export default function HourlyProfile({onChange = (data) => {}}) {
    let profiles = [{
        name: "Common Household", // https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=9316723 - Page 1, Figure 7
        hourlyProfile: [1.5, 1, 0.8, 0.3, 0.2, 0.2, 0.2, 0.6, 2, 4, 1, 0.8, 3, 4, 3, 1, 0.6, 1, 2, 4, 5, 4.5, 3, 2]
    }, {
        name: "Commercial Building", // Me :)
        hourlyProfile: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 2, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 2, 1, 0.5, 0.5, 0.5]
    }]

    const [selectedProfile, setSelectedProfile] = useState("Common Household")

    useEffect(() => {
        onChange(profiles[0])
    }, [])

    return (
        <>
            <div className="mb-3">
                <div>
                    <label>Hourly Profile</label>
                    <select className="form-select" defaultValue={selectedProfile} onChange={e => {
                        setSelectedProfile(e.target.value);
                        onChange(profiles.find(it => it.name === e.target.value).hourlyProfile)
                    }}>
                        {profiles.map(it => <option key={it.name} value={it.name}>{it.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="mb-3">
                <HourlyProfileChart hourlyProfile={profiles.find(it => it.name === selectedProfile).hourlyProfile} />
            </div>
        </>
    )
}