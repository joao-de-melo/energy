
import {Line} from 'react-chartjs-2';
import {Chart, registerables} from "chart.js";

Chart.register(...registerables);

export default function HourlyProfileChart({hourlyProfile = []}) {
    let labels  = Array(24).fill(0).map((element, index) => index);

    let max = Math.max(...hourlyProfile)
    let adjusted = hourlyProfile.map(n => n / max)

    const dataPoints = {
        labels,
        datasets: [
            {
                label: 'Profile',
                data: adjusted,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
                text: 'Profile',
            },
        },
        scales: {
            y: {
                display: false,
                min: 0
            },
            x: {
                title: {
                    display: false,
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