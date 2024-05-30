import Expected from "../../../services/expected";


export default function handler(req, res) {
    if (!req.query.lat || !req.query.lng) {
        res.status(400).json({
            message: "Invalid request"
        })
        return;
    }

    Expected.determine(req.query.lat, req.query.lng)
        .then(data => {
            res.status(200).json(data)
        })
        .catch(e => {
            console.log(e)
            res.status(500).json(e)
        })
}