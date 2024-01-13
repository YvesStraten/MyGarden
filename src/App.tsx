import { useEffect, useState } from "react";
import "./App.css";

/* Defines a type for the objects
in the array */
type tahan = {
	id: string,
	name: string,
	value: number
}

function App() {
	const [tahanData, setTahanData] = useState<tahan[]>([]);

	useEffect(() => {
		const fetcher = () => {
			fetch("https://api.thingspeak.com/channels/2400298/feeds.json?api_key=SVWPDJG7Y4WJZUKX&results=1").then(res => res.json()).then(data => {
				const newData = []

				// Gets the number of fields
				let size = Object.keys(data["feeds"][0]).length - 2;

				for (let i = 1; i <= size; i++) {
					// Generate random id for each field
					const id = crypto.randomUUID();

					// Gets the field values and rounds them
					const field = data["feeds"][0][`field${i}`];
					const rounded = parseFloat(field)

					// Field name
					const fieldName = data["channel"][`field${i}`];
					newData.push({ id: id, name: fieldName, value: rounded });
				}
				setTahanData(newData);
				console.log(tahanData);
			})
		}
		fetcher();

		const intervalId = setInterval(() => fetcher(), 20000);
		return () => clearInterval(intervalId)
	}, [])

	return (
		<>
			{tahanData.map((tahan) => {
				if (tahan.name.includes("humidity")) {
					return (
						<div key={tahan.id}>
							<h1 >{tahan.name}</h1>
							<h1>{tahan.value}%</h1>
						</div>
					)
				} else {
					return (
						<div key={tahan.id}>
							<h1 >{tahan.name}</h1>
							<h1>{tahan.value}</h1>
						</div>
					)
				}
			})}
		</>
	);
}

export default App;
