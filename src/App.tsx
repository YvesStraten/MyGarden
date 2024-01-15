import { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
	const [isLoading, setLoading] = useState<boolean>(false);

	return (
		<>
			{isLoading === false ? (
				<Dashboard setLoading={setLoading} />
			) : (
				<h1>Loading...</h1>
			)}
		</>
	);
}

export default App;
