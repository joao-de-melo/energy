import Batteries from "../../../services/battery";

export default function handler(req, res) {
    res.status(200).json({
        list: Batteries.listAll()
    })
}