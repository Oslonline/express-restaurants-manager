import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";

import { FaPlus } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ConfirmationModal from "../components/common/ConfirmationModal";
import SuccessMessage from "../components/common/SuccessMessage";

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [restaurantData, setRestaurantData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formModified, setFormModified] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    hire_date: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/restaurants/${id}`)
      .then((response) => {
        setRestaurant(response.data);
        setRestaurantData(response.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/restaurants/${id}/employees`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
  };

  const openConfirmationModal = (id) => {
    setEmployeeToDelete(id);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleAddButtonClick = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
    setFormModified(true);
  };

  const handleUpdateRestaurant = (e) => {
    e.preventDefault();

    if (Object.values(restaurantData).some((value) => value === "")) {
      setErrorMessage("Veuillez remplir tous les champs.");
    } else if (parseInt(restaurantData.places) > 250) {
      setErrorMessage("Le nombre de places ne peut pas dépasser 250.");
    } else {
      axios
        .put(`http://localhost:5000/restaurants/${id}`, restaurantData)
        .then(() => {
          setErrorMessage("");
          setSuccessMessage("Restaurant mis à jour avec succès");
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            setSuccessMessage("");
          }, 3000);
          setFormModified(false);
        })
        .catch((err) => {
          setErrorMessage("Une erreur s'est produite lors de la sauvegarde des changements.");
          console.log(err);
        });
    }
  };

  const handleEmployeeDelete = () => {
    axios
      .delete(`http://localhost:5000/restaurants/${id}/employees/${employeeToDelete}`)
      .then(() => {
        setEmployees(employees.filter((employee) => employee.id !== employeeToDelete));
        closeConfirmationModal();
        setSuccessMessage("Employé supprimé avec succès");
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMessage("");
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        closeConfirmationModal();
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { first_name, last_name, hire_date } = newEmployee;

    if (!first_name || !last_name || !hire_date) {
      setAddErrorMessage("Veuillez remplir tous les champs du formulaire.");
    } else {
      axios
        .post(`http://localhost:5000/restaurants/${id}/employees`, newEmployee)
        .then(() => {
          axios
            .get(`http://localhost:5000/restaurants/${id}/employees`)
            .then((response) => {
              setEmployees(response.data);
              setNewEmployee({
                first_name: "",
                last_name: "",
                hire_date: "",
              });
              setShowAddModal(false);
              setSuccessMessage("Employé ajouté avec succès !");
              setShowSuccessMessage(true);
              setTimeout(() => {
                setShowSuccessMessage(false);
              }, 3000);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${restaurantData.name} - Restaurants`}</title>
      </Helmet>
      <div className="flex flex-col gap-8 bg-gray-50 p-8">
        <div>
          <h1 className="mb-2 text-xl font-semibold">Informations du restaurant :</h1>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
          {Object.keys(restaurant).length > 0 && (
            <form className="flex w-fit flex-col gap-2" onSubmit={handleUpdateRestaurant}>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="name">
                  Nom
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="name" value={restaurantData.name} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="city">
                  Ville
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="city" value={restaurantData.city} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="places">
                  Nb Places
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="number" min="1" name="places" value={restaurantData.places} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="terrace">
                  Terrasse
                </label>
                <select className="rounded-md border border-gray-200 bg-white p-1" name="terrace" value={restaurantData.terrace} onChange={handleInputChange}>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="parking">
                  Parking
                </label>
                <select className="rounded-md border border-gray-200 bg-white p-1" name="parking" value={restaurantData.parking} onChange={handleInputChange}>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
              <button className={`rounded-md border border-sky-600 bg-sky-600 py-1 text-gray-50 hover:bg-transparent hover:text-sky-600 ${!formModified && "cursor-not-allowed opacity-50"}`} type="submit" disabled={!formModified}>
                Update
              </button>
            </form>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Employés du restaurant :</h2>
            <button onClick={handleAddButtonClick} className="flex items-center gap-2 rounded-md border border-green-600 bg-green-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-green-600">
              <p>Ajouter un employé</p>
              <FaPlus />
            </button>
          </div>
          {employees.length <= 0 && <p>Aucun employés dans ce restaurant, veuillez en ajouter.</p>}
          {employees.length > 0 &&
            employees.map((employee) => (
              <div className="flex justify-between rounded-md border border-gray-400 p-4" key={employee.id}>
                <div className="flex flex-col justify-between">
                  <p>{employee.first_name}</p>
                  <p>{employee.last_name}</p>
                  <p>Recruté le : {formatDate(employee.hire_date)}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`employees/${employee.id}`} className="flex items-center justify-center gap-2 rounded-md border border-sky-600 bg-sky-600 px-3 py-2 text-gray-50 hover:bg-transparent hover:text-sky-600">
                    <p>Modifier</p>
                  </Link>
                  <button onClick={() => openConfirmationModal(employee.id)} className="flex items-center justify-center gap-2 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-gray-50 hover:bg-transparent hover:text-red-600">
                    <p>Supprimer</p>
                  </button>
                </div>
              </div>
            ))}
        </div>

        {showAddModal && (
          <div onClick={handleCloseAddModal} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div onClick={(e) => e.stopPropagation()} className="flex min-w-96 flex-col gap-2 rounded-md bg-white p-8">
              <h2 className="text-xl font-semibold text-gray-950">Ajouter un employé :</h2>
              <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
                {addErrorMessage && <div className="text-red-600">{addErrorMessage}</div>}
                <div className="flex flex-col">
                  <label className="text-sm" htmlFor="name">
                    Nom
                  </label>
                  <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="first_name" placeholder="Prénom" onChange={handleChange} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm" htmlFor="city">
                    Ville
                  </label>
                  <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="last_name" placeholder="Nom" onChange={handleChange} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm" htmlFor="places">
                    Date d'embauche
                  </label>
                  <DatePicker
                    className="w-full rounded-md border border-gray-200 bg-white p-1"
                    placeholderText="05/12/2024"
                    selected={newEmployee.hire_date ? new Date(newEmployee.hire_date) : null} // Ajoute cette ligne pour définir la date sélectionnée dans le datepicker
                    onChange={(date) => setNewEmployee((prevEmployee) => ({ ...prevEmployee, hire_date: date }))} // Met à jour l'état newEmployee avec la date sélectionnée
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button type="submit" className="rounded-md bg-green-500 px-4 py-2 text-gray-50 hover:bg-green-600">
                    Ajouter
                  </button>
                  <button type="button" onClick={handleCloseAddModal} className="ml-2 rounded-md bg-red-500 px-4 py-2 text-gray-50 hover:bg-red-600">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmationModal
          show={showConfirmationModal}
          onClose={closeConfirmationModal}
          onConfirm={handleEmployeeDelete}
          message={{
            title: "Êtes-vous sûr de vouloir supprimer cet employé ?",
            content: "L'employé et ses informations seront supprimer définitivement.",
          }}
        />

        <SuccessMessage show={showSuccessMessage} message={successMessage} />
      </div>
    </>
  );
}
