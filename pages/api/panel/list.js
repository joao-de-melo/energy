import Panels from "../../../services/panel";

export default function handler(req, res) {
    res.status(200).json({
        list: Panels.listAll()
    })
}