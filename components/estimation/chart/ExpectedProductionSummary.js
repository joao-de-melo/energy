export default function ExpectedProductionSummary({annual, months = []}) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const colors = [
        {"value": "rgba(59, 80, 91, 1)"},
        {"value": "rgba(31, 120, 180, 1)"},
        {"value": "rgba(178, 223, 138, 1)"},
        {"value": "rgba(51, 160, 44, 1)"},
        {"value": "rgba(251, 154, 153, 1)"},
        {"value": "rgba(227, 26, 28, 1)"},
        {"value": "rgba(253, 191, 111, 1)"},
        {"value": "rgba(255, 127, 0, 1)"},
        {"value": "rgba(176, 18, 117, 1)"},
        {"value": "rgba(106, 61, 154, 1)"},
        {"value": "rgba(110, 110, 10, 1)"},
        {"value": "rgba(177, 89, 40, 1)"}
    ]
    let data = months ?? []
    let annualData = annual ?? 0

    return (
        <div className="row">
            <h5 className="text-center">Expected Production <small style={{fontSize: "10px"}}>Annually: {Math.round(annualData / 1000)} kW / kWp</small></h5>
            {monthNames.map((it, i) => <div className="text-center col p-1" key={"r_" + i}>
                <span style={{color: colors[i].value}}>{it}</span><br/>
                <span style={{
                    color: colors[i].value,
                    fontSize: "10px"
                }}>{!data[i] ? "..." : Math.round(data[i].total / 1000) + " kW / kWp"}</span><br/>
            </div>)}
        </div>
    )
}