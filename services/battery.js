



let Batteries = {
    listAll () {
        return [
            {
                id: "wisely15",
                name: "Wisely 15kW",
                capacity: 15000,
                duration: 10,
                voltage: 48,
                price: 4000.00 // euros
            }, {
                id: "wisely5",
                name: "Wisely 5kW",
                duration: 10,
                capacity: 5000,
                voltage: 24,
                price: 2000.00 // euros
            }
        ]
    },
    findById(batteryId) {
        return this.listAll().find(it => it.id === batteryId);
    }
}

export default Batteries