

let Backups = {
    listAll () {
        return [{
            id: "grid",
            name: "Grid",
            kwCost: 0.15, // per kWh
            monthlyCost: 30,
            initialCost: 0,
            capacity: null,
            duration: null // in years
        }, {
            id: "hundai5",
            name: "Hundai 5KW",
            capacity: 5,
            kwCost: 0.30, // per kWh
            monthlyCost: 0,
            initialCost: 800.00,
            duration: 12 // years
        }]
    },

    findById (id) {
        return this.listAll().find(it => it.id === id)
    },

    grid () {
        return this.findById("grid")
    }
}

export default Backups