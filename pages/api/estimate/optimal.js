import Panels from "../../../services/panel";
import Batteries from "../../../services/battery";
import {fromRequest, Instance} from "../../../services/genetic";
import Backups from "../../../services/backup";

export default function handler(req, res) {
    let monthlyWithMonth = req.body.projection.monthly.map((it, m) => {
        it.month = m;
        return it;
    });
    let maxMonthlyProduction = monthlyWithMonth.reduce((max, current) => {
        if (max.total < current.total) return current;
        else return max;
    })

    let daysInMaxMonth = new Date(2023, maxMonthlyProduction.month, 0).getDate();
    let maxDailyProduction = maxMonthlyProduction.total / daysInMaxMonth;

    let maxKwpRequired = req.body.consumption.expected * 1000 / maxDailyProduction

    let panelInfo = Panels.findById(req.body.panelId)
    let minPanels = Math.ceil(maxKwpRequired * 1000 / panelInfo.potency);
    let maxPanels = minPanels * 10;

    let batteryInfo = Batteries.findById(req.body.batteryId)
    let minBatteries = 0;
    let maxBatteries = Math.ceil((req.body.consumption.expected * 1000 * 5) / batteryInfo.capacity)

    let backupInfo = Backups.findById(req.body.backupId)

    let context = fromRequest(req.body, 25, panelInfo, batteryInfo, backupInfo, Backups.grid());

    let options = []
    for (let nP = minPanels; nP < maxPanels; nP++) {
        for (let nB = minBatteries; nB < maxBatteries; nB++) {
            options.push(new Instance(nP, nB))
        }
    }

    let best = options.reduce((best, opt) => {
        if (best.fitness(context).diff > opt.fitness(context).diff) return opt;
        return best;
    });

    console.log(JSON.stringify(best))

    res.status(200).json(best)
}