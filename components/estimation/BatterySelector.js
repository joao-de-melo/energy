import {useEffect, useState} from "react";

export default function BatterySelector({onChange = (data) => {}}) {
    const [batteries, setBatteries] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [selection, setSelection] = useState("")

    useEffect(() => {
        fetch("/api/battery/list", {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json())
            .then(d => {
                setBatteries(d.list)
                onChange(d.list[0])
                setLoaded(true)
            })
            .catch(e => console.error(e))
    }, []);

    if (!loaded) {
        return (
            <div className="input-group">
                <select className="form-control" disabled="true">
                    <option>Loading...</option>
                </select>
            </div>
        )
    }

    return (
        <div className="input-group">
            <select className="form-control" defaultValue={selection}
                    onChange={e => {
                        setSelection(e.target.value);
                        onChange(batteries.find(it => it.id === e.target.value));
                    }}>
                {batteries.map((it,i) => <option value={it.id} key={i}>{it.name}</option>)}
            </select>
        </div>
    )
}