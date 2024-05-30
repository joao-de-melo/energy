

let Panels = {
    listAll () {
        return [{
            id: "TSM-DE18M(II)-505",
            name: "Ja Solar 505W",
            potency: 505,
            stc: {
                mpv: 43, // maximum power voltage V
                mpc: 11.75, // maximum power current A
                ocv: 51.9, // open circuit voltage V
                scc: 12.35, // short circuit current A
            },
            brand: "Ja Solar",
            size: {
                width: 110,
                height: 218,
                thickness: 3.5
            },
            weight: 26.3, // kg
            seller: {
                name: "Leroy Merlin",
                guarantee: 12
            },
            duration: 25,
            price: 105
        }]
    },
    findById(panelId) {
        return this.listAll().find(it => it.id === panelId);
    }
}

export default Panels