import { display } from "../types/types";

const Display = ({ char, tahan }: display) => {
	return (
		<div className="tahan_container">
			<h1>{tahan.name}</h1>
			<h1>
				{tahan.value} {char}
			</h1>
			<h2>Past values:</h2>
			<iframe src={tahan.graph} className="iframe"></iframe>
		</div>
	);
};

export default Display;
