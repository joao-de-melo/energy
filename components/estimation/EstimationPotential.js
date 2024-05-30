import {useEffect, useState} from "react";
import {ThreeDots} from "react-loader-spinner";
import MonthlyHourlyPotential from "./chart/MonthlyHourlyPotential";
import ExpectedProductionSummary from "./chart/ExpectedProductionSummary";

let inlineLoadingSpinner = <ThreeDots
    visible={true}
    height="10"
    width="10"
    color="#4fa94d"
    radius="1"
    wrapperStyle={{display: "inline"}}
    wrapperClass=""
/>

function LoadingCode ({loaded, text, suffix}) {
    if (!loaded || !text) return inlineLoadingSpinner;
    else return (
        <code>{text+suffix}</code>
    )
}

export default function EstimationPotential(
    {
        position = {lat: 0, lng: 0},
        onChangeDetails = (data) => {}
    }
) {
    const [loaded, setLoaded] = useState(false)
    const [data, setData] = useState(null)

    useEffect(() => {
        setLoaded(false)
        if (position != null) {
            fetch(`/api/pvout/details?lat=${position.lat}&lng=${position.lng}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(r => r.json())
                .then(d => {
                    setData(d)
                    onChangeDetails(d)
                    setLoaded(true)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [position]);

    return (
        <>
            <div className="row">
                <div className="feature col mt-5 text-center">
                    <div className="feature-icon">
                        <img width="40px" src="images/gps.png" alt="Tilt"/>
                    </div>
                    <h2 className="mt-3">Position</h2>
                    <div className="m-2">
                        This position is at latitude <code>{position?.lat ?? ""}</code> and
                        longitude <code>{position?.lng ?? ""}</code>
                    </div>
                </div>
                <div className="feature col mt-5 text-center">
                    <div className="feature-icon">
                        <img width="40px" src="images/tilt.png" alt="Tilt"/>
                    </div>
                    <h2 className="mt-3">Tilt</h2>
                    <div className="m-2">
                        The ideal tilt for this position
                        is: <LoadingCode loaded={loaded} text={data?.tilt} suffix="&deg;" />
                    </div>
                </div>
                <div className="feature col mt-5 text-center">
                    <div className="feature-icon">
                        <img width="40px" src="images/azimuth.png" alt="Azimuth"/>
                    </div>
                    <h2 className="mt-3">Azimuth</h2>
                    <div className="m-2">
                        The ideal azimuth for this position
                        is: <LoadingCode loaded={loaded} text={data?.azimuth} suffix="" />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <ExpectedProductionSummary annual={data?.annual} months={data?.monthly}/>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <MonthlyHourlyPotential months={data?.monthly}/>
                </div>
            </div>
        </>
    )
}