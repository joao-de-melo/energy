import Backups from "../../../services/backup";

export default function handler(req, res) {
    res.status(200).json({
        list: Backups.listAll()
    })
}