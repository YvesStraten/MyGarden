import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./settings.css";

const Fields = [
	{
		label: "Max temperature:",
		type: "number",
		id: "maxTemp",
	},

	{
		label: "Max humidity:",
		type: "number",
		id: "maxHumid",
	},

	{
		label: "Max Light:",
		type: "number",
		id: "maxLx",
	},
];

// TODO: send updated settings to thingspeak
const Settings = () => {
	return (
		<div class="settings">
			<form>
				<div class="icon">
					<Link to="/" id="X">
						<FontAwesomeIcon icon={faXmark} />
					</Link>
				</div>
				{Fields.map((field) => (
					<>
						<label for={field.id}>{field.label}</label>
						<br />
						<input id={field.id} type={field.type} />
						<br />
					</>
				))}
				<button type="submit" class="submit">
					<FontAwesomeIcon icon={faCheck} />
				</button>
			</form>
		</div>
	);
};

export default Settings;
