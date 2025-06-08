import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { settingsForm } from "../types/types";

/* Array of all the possible inputs */
const fields = [
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
  const [formData, setFormData] = useState<settingsForm>({
    maxtemp: "",
    mintemp: "",
    maxhumid: "",
    minhumid: "",
    maxlight: "",
    minlight: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: parseInt(value),
    }));
  };

  const updateSettings = async (event: React.MouseEvent<HTMLButtonElement>) => {
    /* 		Updates settings by adding them each as a query
		params to the request */
    event?.preventDefault();
    const base = new URL(
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
    <div className="flex flex-col items-center">
      <form>
        <Link
          to="/"
          id="X"
          className="border rounded-full pr-1 pl-1 bg-gray-50 hover:bg-gray-200"
        >
          <FontAwesomeIcon icon={faXmark} />
        </Link>
        <div className="flex flex-col gap-2">
          {fields.map((field) => {
            /* Maps over all of the fields possible to make a form */
            const value = formData[field.id as keyof settingsForm];
            return (
              <div key={field.id}>
                <label htmlFor={field.id} className="font-bold">
                  {field.label}
                </label>
                <br />
                <input
                  id={field.id}
                  type={field.type}
                  onChange={handleChange}
                  className="bg-gray-50"
                  placeholder="0"
                  value={value}
                  name={field.id}
                  required
                />
                <br />
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="border rounded-full pr-1 pl-1 bg-gray-50 hover:bg-gray-200"
          onClick={updateSettings}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
    </div>
  );
};

export default Settings;
