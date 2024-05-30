import axios from "axios";


let Expected = {

    _bestTiltAnnually(latitude) {
        if (latitude < 25) {
            return latitude * 0.87;
        } else if (latitude <= 50) {
            return latitude * 0.76 + 3.1
        } else {
            return latitude
        }
    },

    determine(lat, lng) {
        return new Promise((resolve, reject) => {
            let url = `https://api.globalsolaratlas.info/data/pvcalc?loc=${lat},${lng}`;
            let azimuth = parseFloat(lat) >= 0 ? 180 : 0;
            // let tilt = bestTiltAnnually(parseInt(req.query.lat));
            let tilt = parseInt(lat);
            axios.post(url, {
                "type": "rooftopSmall",
                "systemSize": {"type": "capacity", "value": 1},
                "orientation": {"azimuth": azimuth, "tilt": tilt}
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0. 0.0 Safari/537.36'
                }
            })
                .then(resp => {
                    resolve({
                        tilt: tilt,
                        azimuth: azimuth,
                        annual: resp.data.annual.data["PVOUT_total"] * 1000,
                        monthly: resp.data.monthly.data["PVOUT_total"].map((d, i) => {
                            return {
                                total: d * 1000,
                                hours: resp.data["monthly-hourly"].data["PVOUT_total"][i]
                            }
                        })
                    })
                })
                .catch(e => {
                    reject(e)
                })
        })
    }
}

export default Expected