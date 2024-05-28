import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SuccessMessage from "../components/common/SuccessMessage";

export default function Employee() {
  const { id, rid } = useParams();
  const [employeeData, setEmployeeData] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formModified, setFormModified] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/restaurants/${rid}/employees/${id}`)
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, rid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
    setFormModified(true);
  };

  const handleDateChange = (date) => {
    setEmployeeData({ ...employeeData, hire_date: date }); // Assuming the name for hire date is 'hire_date'
    setFormModified(true);
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();

    if (!formModified) {
      setErrorMessage("Aucune modification détectée.");
      return;
    }

    if (Object.values(employeeData).some((value) => value === "")) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    axios
      .put(`http://localhost:5000/restaurants/${rid}/employees/${id}`, employeeData)
      .then(() => {
        setErrorMessage("");
        setSuccessMessage("Informations de l'employé modifiées avec succès !");
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage("");
        }, 3000);
        setFormModified(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Helmet>
        <title>{`${employeeData.first_name} ${employeeData.last_name}  - Employés`}</title>
      </Helmet>
      <div className="flex flex-col gap-8 bg-gray-50 p-8">
        <div>
          <h1 className="mb-2 text-xl font-semibold">Informations de l'employé :</h1>
          {Object.keys(employeeData).length > 0 && (
            <form className="flex w-fit flex-col gap-2" onSubmit={handleUpdateEmployee}>
              {errorMessage && <div className="text-red-600">{errorMessage}</div>}
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="first_name">
                  Prénom
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="first_name" value={employeeData.first_name} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="last_name">
                  Nom
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="last_name" value={employeeData.last_name} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="hire_date">
                  Date d'embauche
                </label>
                <DatePicker className="rounded-md border border-gray-200 bg-white p-1" selected={employeeData.hire_date ? new Date(employeeData.hire_date) : null} onChange={(date) => handleInputChange({ target: { name: "hire_date", value: date } })} dateFormat="dd/MM/yyyy" />
              </div>
              <button className={`rounded-md border border-sky-600 bg-sky-600 py-1 text-gray-50 hover:bg-transparent hover:text-sky-600 ${!formModified && "cursor-not-allowed opacity-50"}`} type="submit" disabled={!formModified}>
                Update
              </button>
            </form>
          )}
        </div>

        <SuccessMessage show={showSuccessMessage} message={successMessage} />
      </div>
    </>
  );
}
