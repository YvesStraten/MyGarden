import { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
	const [isLoading, setLoading] = useState<boolean>(true);
	return (
		<>
			{isLoading === true ? (
				<Dashboard setLoading={setLoading} />
			) : (
				<h1>Loading...</h1>
			)}
		</>
	);
}

export default App;
