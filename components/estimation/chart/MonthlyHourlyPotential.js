import {Line} from 'react-chartjs-2';
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

export default function MonthlyHourlyPotential({months = [[]]}) {
    let labels = Array(24).fill(0).map((element, index) => index);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const colors = [
        {"backgroundColor": "rgba(166, 206, 227, 1)"},
        {"backgroundColor": "rgba(31, 120, 180, 1)"},
        {"backgroundColor": "rgba(178, 223, 138, 1)"},
        {"backgroundColor": "rgba(51, 160, 44, 1)"},
        {"backgroundColor": "rgba(251, 154, 153, 1)"},
        {"backgroundColor": "rgba(227, 26, 28, 1)"},
        {"backgroundColor": "rgba(253, 191, 111, 1)"},
        {"backgroundColor": "rgba(255, 127, 0, 1)"},
        {"backgroundColor": "rgba(202, 178, 214, 1)"},
        {"backgroundColor": "rgba(106, 61, 154, 1)"},
        {"backgroundColor": "rgba(255, 255, 153, 1)"},
        {"backgroundColor": "rgba(177, 89, 40, 1)"}
    ]

    const dataPoints = {
        labels,
        datasets: months.map((it, index) => {
            return {
                label: monthNames[index],
                data: it.hours,
                backgroundColor: colors[index].backgroundColor,
                borderColor: colors[index].backgroundColor
            }
        }),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
        },
        scales: {
            y: {
                min: 0,
                title: {
                    display: true,
                    text: "Wh / kWp"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Hour of the Day"
                }
            }
        }
    };

    return (
        <>

            <Line
                options={options}
                data={dataPoints}
                width={400}
                height={100}
            />
        </>
    )
}