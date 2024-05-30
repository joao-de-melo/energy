'use client';

import {useEffect, useState} from "react";
import MapViewer from "../map/MapViewer";
import HourlyProfile from "../profile/HourlyProfile";
import EstimationPotential from "./EstimationPotential";
import PanelSelector from "./PanelSelector";
import BatterySelector from "./BatterySelector";
import BackupSelector from "./BackupSelector";

const Estimation = () => {
    const [position, setPosition] = useState(null)
    const [projection, setProjection] = useState(null)
    const [consumptionAmount, setConsumptionAmount] = useState(13)
    const [consumptionPeriod, setConsumptionPeriod] = useState("day")
    const [hourlyProfile, setHourlyProfile] = useState(Array(24).fill(0))
    const [panel, setPanel] = useState(null)
    const [battery, setBattery] = useState(null)
    const [backup, setBackup] = useState(null)

    useEffect(() => {
        if (!panel || !backup || !battery || !projection) return;
        fetch("/api/estimate/optimal", {
            method: "POST",
            body: JSON.stringify({
                position: position,
                consumption: {
                    expected: consumptionAmount,
                    period: consumptionPeriod,
                    profile: {
                        hours: hourlyProfile.hourlyProfile
                    }
                },
                projection: projection,
                panelId: panel.id,
                batteryId: battery.id,
                backupId: backup.id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json())
            .catch(e => console.error(e))
    }, [
        position,
        consumptionPeriod, consumptionAmount,
        hourlyProfile, panel, battery,
        backup
    ]);

    return (<>
        <div className="row">
            <div className="col">
                <MapViewer onChangePosition={setPosition}/>
            </div>
        </div>

        <EstimationPotential position={position} onChangeDetails={setProjection} />

        <div className="row">
            <div className="col-3">
                <h4>Consumption</h4>

                <div className="mb-3">
                    <div className="input-group">
                        <input type="number" className="form-control" value={consumptionAmount}
                               onChange={e => setConsumptionAmount(parseInt(e.target.value))}/>
                        <span className="input-group-text">kWh</span>
                        <select className="form-control" defaultValue={consumptionPeriod}
                                onChange={e => setConsumptionPeriod(e.target.value)}>
                            <option value="day">Per Day</option>
                            <option value="month">Per Month</option>
                            <option value="year">Per Year</option>
                        </select>
                    </div>
                </div>

                <HourlyProfile onChange={setHourlyProfile}/>

                <div className="input-group">
                    <span className="input-group-text">Heating</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value=""
                               aria-label="Checkbox for following text input"/>
                    </div>
                    <input type="number" step="0.1" className="form-control" value="7.5"/>
                    <span className="input-group-text">kW/month</span>
                </div>
                <select className="form-select mb-3" multiple="true" size="12" aria-label="size 3 select example">
                    <option value="0" selected={true}>January</option>
                    <option value="1" selected={true}>February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10" selected={true}>November</option>
                    <option value="11" selected={true}>December</option>
                </select>


                <div className="input-group">
                    <span className="input-group-text">Cooling</span>
                    <div className="input-group-text">
                        <input className="form-check-input mt-0" type="checkbox" value=""
                               aria-label="Checkbox for following text input"/>
                    </div>
                    <input type="text" className="form-control" value="5"/>
                    <span className="input-group-text">kW/month</span>
                </div>
                <select className="form-select mb-3" multiple="true" size="12" aria-label="size 3 select example">
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6" selected={true}>July</option>
                    <option value="7" selected={true}>August</option>
                    <option value="8" selected={true}>September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>

                <hr/>

                <h4>Panels</h4>

                <div className="mb-3">
                    <PanelSelector onChange={setPanel}/>
                </div>

                <hr/>

                <h4>Battery</h4>

                <div className="mb-3">
                    <BatterySelector onChange={setBattery}/>
                </div>

                <hr/>

                <h4>Backup</h4>

                <div className="mb-3">
                    <BackupSelector onChange={setBackup}/>
                </div>
            </div>
            <div className="col">

            </div>
        </div>
    </>);
};

export default Estimation;