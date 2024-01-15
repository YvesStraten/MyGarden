import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import "./settings.css";
import { useState } from "react";
import formtype from "../types/formtype";

const Fields = [
	{
		label: "Max temperature:",
		type: "number",
		id: "maxtemp",
	},

	{
		label: "Max humidity:",
		type: "number",
		id: "maxhumid",
	},

	{
		label: "Max Light:",
		type: "number",
		id: "maxlight",
	},
];

const Settings = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<formtype>({
		maxtemp: "",
		maxhumid: "",
		maxlight: "",
	});

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
	};

	const updateSettings = async (event: any) => {
		event?.preventDefault();
		let base = new URL(
			"https://api.thingspeak.com/update?api_key=3MH3CVQDFPIP1G0T",
		);

		for (let i = 0; i < Object.keys(formData).length; i++) {
			base.searchParams.append(
				`field${i + 1}`,
				`${Object.values(formData)[i]}`,
			);
		}

		await fetch(base.href)
			.then((res) => res.json())
			.then((data) => console.log(data));

		navigate("/");
	};

	return (
		<div className="formSettings">
			<form>
				<div className="icon">
					<Link to="/" id="X">
						<FontAwesomeIcon icon={faXmark} />
					</Link>
				</div>
				{Fields.map((field) => (
					<div key={field.id}>
						<label htmlFor={field.id}>{field.label}</label>
						<br />
						<input
							id={field.id}
							type={field.type}
							onChange={handleChange}
							value={formData[field.id]}
							name={field.id}
							required
						/>
						<br />
					</div>
				))}
				<button type="submit" className="submit" onClick={updateSettings}>
					<FontAwesomeIcon icon={faCheck} />
				</button>
			</form>
		</div>
	);
};

export default Settings;
