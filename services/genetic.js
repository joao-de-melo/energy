import backup from "./backup";
import Backups from "./backup";

class DailyProfile {
    constructor(hours = [0.1]) {
        this.hours = hours;
    }

    sum() {
        return this.hours.reduce((acc, val) => acc + val, 0);
    }

    diff(dailyProfile = new DailyProfile()) {
        return new DailyProfile(
            dailyProfile.hours.map((it, ind) => this.hours[ind] - it)
        )
    }

    times(val) {
        return new DailyProfile(
            this.hours.map(it => it * val)
        )
    }

    minus(toRemove = new DailyProfile()) {
        return new DailyProfile(
            this.hours.map((it, idx) => Math.max(it - toRemove.hours[idx], 0))
        )
    }
}

class Consumption {
    constructor(expected = 13, period = "day", profile = new DailyProfile()) {
        this.expected = expected;
        this.period = period;
        this.profile = profile;
    }

    _expectedPerDay() {
        if (this.period === "day") return this.expected * 1000;
        else if (this.period === "month") return 1000 * this.expected / 30;
        else return 1000 * this.expected / 365;
    }

    loadProfile() {
        let scaleFactor = this._expectedPerDay() / this.profile.sum()
        return new DailyProfile(this.profile.hours.map(it => it * scaleFactor))
    }
}

class SolarPanel {
    constructor(info = {potency: 1, duration: 25}) {
        this.info = info;
    }

    generationProfile(dailyProduction1kw = new DailyProfile()) {
        return new DailyProfile(
            dailyProduction1kw.hours.map(it => this.info.potency * it / 1000)
        )
    }

    buysIn(years) {
        return Math.ceil(years / this.info.duration)
    }

    price() {
        return this.info.price
    }
}

class MonthProjection {
    constructor(month = 1, average = 20.1, dailyProfile = new DailyProfile()) {
        this.month = month;
        this.average = average;
        this.dailyProfile = dailyProfile;
    }
}

class Projection {
    constructor(months = [new MonthProjection()]) {
        this.months = months;
    }
}

class Battery {
    constructor(info = {capacity: 2}) {
        this.info = info;
    }

    capacity(count = 1) {
        return this.info.capacity * count
    }

    buysIn(years) {
        return Math.ceil(years / this.info.duration)
    }

    price() {
        return this.info.price;
    }
}

class Backup {
    constructor(info) {
        this.monthlyCost = info.monthlyCost
        this.kwCost = info.kwCost
        this.initialCost = info.initialCost;
        this.duration = info.duration; // optional years
    }

    buysIn(years) {
        if (this.duration == null) return 0;
        return Math.ceil(years / this.duration)
    }
}


class Context {
    constructor(
        years = 1,
        grid = new Backup(),
        projection = new Projection(),
        consumption = new Consumption(),
        solarPanel = new SolarPanel(),
        battery = new Battery(),
        backup = new Backup()
    ) {
        this.years = years;
        this.grid = grid;
        this.projection = projection;
        this.consumption = consumption;
        this.battery = battery;
        this.solarPanel = solarPanel;
        this.backup = backup;
    }
}

class Month {
    constructor(year, month) {
        this.year = year;
        this.month = month;
    }

    days() {
        let date = new Date(this.year, this.month, 1); // Start at the first day of the month
        let days = [];

        // Check that the month matches up, if not, we've moved to the next month
        while (date.getMonth() === this.month) {
            // Push the date (formatted if desired) to the array
            days.push(new Date(date)); // Adds a new Date object to avoid mutation of the original date
            date.setDate(date.getDate() + 1); // Move to the next day
        }

        return days;
    }
}

class BatteryCharge {
    constructor(capacity = 15000, initialState = capacity / 2) {
        this.capacity = capacity;
        this.currentState = initialState;
    }

    add(profile = new DailyProfile()) {
        return new BatteryCharge(this.capacity, Math.max(0, Math.min(this.currentState + profile.sum(), this.capacity)))
    }

    addVal(val = 1.2) {
        return new BatteryCharge(this.capacity, Math.max(0, Math.min(this.currentState + val, this.capacity)))
    }

    usedBackup(diff = new DailyProfile()) {
        let batteryState = this.currentState;
        return diff.hours.reduce((acc, val) => {
            let used = 0;
            if (val < 0 && (batteryState.currentState + val) < 0) {
                used = (batteryState.currentState + val) * -1
            }
            batteryState = this.addVal(val)
            return acc + used
        }, 0)
    }

    usedBattery(diff = new DailyProfile()) {
        let batteryState = this.currentState;
        return diff.hours.reduce((acc, val) => {
            let newState = this.addVal(val);
            let charged = 0;
            if (val > 0) {
                charged = newState.currentState - batteryState.currentState;
            }
            batteryState = newState
            return acc + charged
        }, 0)
    }

    wastedBattery(diff = new DailyProfile()) {
        let batteryState = this.currentState;
        return diff.hours.reduce((acc, val) => {
            let wasted = 0;
            if (val > 0 && (batteryState.currentState + val) > this.capacity) {
                wasted = (batteryState.currentState + val) - this.capacity
            }
            batteryState = this.addVal(val)
            return acc + wasted
        }, 0)
    }
}

class DayEstimation {
    constructor(day, endBattery, usedBattery, backup, waste) {
        this.day = day;
        this.endBattery = endBattery;
        this.usedBattery = usedBattery;
        this.backup = backup;
        this.waste = waste;
    }
}

class MonthEstimation {
    constructor(dailyUsage = 1.0, dailyProduction = 2.0, dailyPanelUsage = 2.0, diff = 1.0, days = [new DayEstimation()]) {
        this.dailyUsage = dailyUsage;
        this.dailyProduction = dailyProduction;
        this.dailyPanelUsage = dailyPanelUsage;
        this.diff = diff;
        this.days = days;
    }

    totalWaste() {
        return this.days.reduce((acc, val) => acc + val.waste, 0);
    }

    totalBackup() {
        return this.days.reduce((acc, val) => acc + val.backup, 0);
    }

    totalUsedBattery() {
        return this.days.reduce((acc, val) => acc + val.usedBattery, 0)
    }

    totalUsedPanel() {
        return this.dailyPanelUsage * this.days.length;
    }

    totalSaved() {
        return this.totalUsedBattery() + this.totalUsedPanel();
    }
}

class YearEstimation {
    constructor(months = [new MonthEstimation()]) {
        this.months = months;
    }

    totalWaste() {
        return this.months.reduce((acc, val) => acc + val.totalWaste(), 0)
    }

    totalBackup() {
        return this.months.reduce((acc, val) => acc + val.totalBackup(), 0)
    }

    totalSaved() {
        return this.months.reduce((acc, val) => acc + val.totalSaved(), 0)
    }

    totalBatterySaved() {
        return this.months.reduce((acc, val) => acc + val.totalUsedBattery(), 0)
    }

    totalPanelSaved() {
        return this.months.reduce((acc, val) => acc + val.totalUsedPanel(), 0)
    }
}

class Instance {
    constructor(panels, batteries) {
        this.panels = panels;
        this.batteries = batteries;
        this._cache = null;
    }

    fitness (context) {
        if (!this._cache) {
            this._cache = this._fitness(context)
        }
        return this._cache
    }

    _fitness(context = new Context()) {
        let batteryCapacity = context.battery.capacity(this.batteries);
        let yearEstimation = new YearEstimation(context.projection.months.map(m => {
            let productionProfile = context.solarPanel.generationProfile(m.dailyProfile).times(this.panels);
            let usageProfile = context.consumption.loadProfile()
            let diff = productionProfile.diff(usageProfile)

            let currentMonth = new Month(2023, m.month);
            let currentBattery = new BatteryCharge(batteryCapacity, batteryCapacity / 2);

            return new MonthEstimation(
                usageProfile.sum(),
                productionProfile.sum(),
                usageProfile.minus(productionProfile).sum(),
                diff.sum(),
                currentMonth.days().map((date, idx) => {
                    let newBatteryCharge = currentBattery.add(diff);
                    let result = new DayEstimation(
                        date,
                        newBatteryCharge.currentState,
                        currentBattery.usedBattery(diff),
                        currentBattery.usedBackup(diff),
                        currentBattery.wastedBattery(diff),
                    );
                    currentBattery = newBatteryCharge;
                    return result
                })
            )
        }))

        let summary = {
            waste: yearEstimation.totalWaste(),
            backup: yearEstimation.totalBackup(),
            saved: {
                total: yearEstimation.totalSaved(),
                battery: yearEstimation.totalBatterySaved(),
                panel: yearEstimation.totalPanelSaved()
            }
        }

        let backupBuys = context.backup.buysIn(context.years);
        let backupInvestment = context.backup.initialCost * backupBuys;
        let backupMonthlyCost = context.years * context.backup.monthlyCost * 12;
        let backupKwCost = summary.backup / 1000 * context.backup.kwCost * context.years;
        let backupTotalCost = Math.round(backupInvestment + backupMonthlyCost + backupKwCost)

        let solarBuys = context.solarPanel.buysIn(context.years);
        let solarInvestment = solarBuys * context.solarPanel.price() * this.panels
        let solarSave = Math.round(summary.saved.panel * context.grid.kwCost / 1000 * context.years)

        let batteryBuys = context.battery.buysIn(context.years)
        let batteryInvestment = batteryBuys * context.battery.price() * this.batteries
        let batterySave = Math.round(summary.saved.battery * context.grid.kwCost / 1000 * context.years)

        let totalCost = backupTotalCost + solarInvestment + batteryInvestment;
        let consumptionExpected = Math.round(context.consumption._expectedPerDay() * 365 * context.years / 1000)
        let costOfConsumptionInGrid = Math.round(consumptionExpected * context.grid.kwCost + (context.grid.monthlyCost * 12 * context.years))
        let rentability = (totalCost - costOfConsumptionInGrid) / context.years;
        return {
            cost: {
                backup: backupTotalCost,
                solar: solarInvestment,
                battery: batteryInvestment,

                total: totalCost
            },
            estimatedInGrid: costOfConsumptionInGrid,
            diff: totalCost - costOfConsumptionInGrid,
            rentability: rentability
        }
    }
}

function fromRequest(request, years, solarPanelInfo, batteryInfo, backupInfo, gridInfo) {
    return new Context(
        years,
        new Backup(gridInfo),
        new Projection(
            request.projection.monthly.map((it, mId) => new MonthProjection(mId, it.total, new DailyProfile(it.hours)))
        ),
        new Consumption(
            request.consumption.expected,
            request.consumption.period,
            new DailyProfile(
                request.consumption.profile.hours
            )
        ),
        new SolarPanel(solarPanelInfo),
        new Battery(batteryInfo),
        new Backup(backupInfo)
    )
}

export {
    Instance,
    fromRequest
}