import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import "./settings.css";
import { useState } from "react";
import { formtype } from "../types/types";

/* Array of all the possible inputs */
const Fields = [
	{
		label: "Max temperature:",
		type: "number",
		id: "maxtemp",
	},

	{
		label: "Min temperature:",
		type: "number",
		id: "mintemp",
	},

	{
		label: "Max humidity:",
		type: "number",
		id: "maxhumid",
	},

	{
		label: "Min humidity:",
		type: "number",
		id: "minhumid",
	},

	{
		label: "Max Light:",
		type: "number",
		id: "maxlight",
	},

	{
		label: "Min Light:",
		type: "number",
		id: "minlight",
	},
];

const Settings = () => {
	// Track the form's state and handle any change
	const navigate = useNavigate();
	const [formData, setFormData] = useState<formtype>({
		maxtemp: "",
		mintemp: "",
		maxhumid: "",
		minhumid: "",
		maxlight: "",
		minlight: "",
	});

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: parseInt(value),
		}));
	};

	const updateSettings = async (event: any) => {
		/* 		Updates settings by adding them each as a query
		Param to the request */
		event?.preventDefault();
		let base = new URL(
			"https://api.thingspeak.com/update?api_key=KREIMHGC02O4Z5OU",
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
				{Fields.map((field) => {
					/* Maps over all of the fields possible to make a form */
					const value = formData[field.id as keyof formtype];
					return (
						<div key={field.id}>
							<label htmlFor={field.id}>{field.label}</label>
							<br />
							<input
								id={field.id}
								type={field.type}
								onChange={handleChange}
								value={value}
								name={field.id}
								required
							/>
							<br />
						</div>
					);
				})}
				<button type="submit" className="submit" onClick={updateSettings}>
					<FontAwesomeIcon icon={faCheck} />
				</button>
			</form>
		</div>
	);
};

export default Settings;
