import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { MdOutlineLocationOn, MdOutlineTableBar } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { FaPlus } from "react-icons/fa6";

import ConfirmationModal from "../components/common/ConfirmationModal";
import SuccessMessage from "../components/common/SuccessMessage";

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    city: "",
    places: 0,
    terrace: "",
    parking: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/restaurants")
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const openConfirmationModal = (id) => {
    setRestaurantToDelete(id);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/restaurants/${restaurantToDelete}`)
      .then(() => {
        setRestaurants(restaurants.filter((r) => r.id !== restaurantToDelete));
        closeConfirmationModal();
        setSuccessMessage("Restaurant supprimé avec succès !");
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        closeConfirmationModal();
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, city, places, terrace, parking } = newRestaurant;

    if (!name || !city || !places || !terrace || !parking) {
      setErrorMessage("Veuillez remplir tous les champs du formulaire.");
    } else if (isNaN(parseInt(places)) || parseInt(places) <= 0) {
      setErrorMessage("Le nombre de places doit être un nombre entier positif.");
    } else if (parseInt(places) > 250) {
      setErrorMessage("Le nombre de places ne peut pas dépasser 250.");
    } else {
      axios
        .post("http://localhost:5000/restaurants", newRestaurant)
        .then(() => {
          axios
            .get("http://localhost:5000/restaurants")
            .then((response) => {
              setRestaurants(response.data);
              setNewRestaurant({
                name: "",
                city: "",
                places: 0,
                terrace: "",
                parking: "",
              });
              setShowAddModal(false);
              setSuccessMessage("Restaurant ajouté avec succès !");
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

  const handleAddButtonClick = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setErrorMessage("");
  };

  return (
    <>
      <div className="flex flex-col gap-8 p-8 bg-gray-50">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-gray-950">Mes restaurants :</h1>
          <button onClick={handleAddButtonClick} className="flex items-center gap-2 rounded-md border border-green-600 bg-green-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-green-600">
            <p>Ajouter un restaurant</p>
            <FaPlus />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {restaurants.map((restaurant) => (
            <div className="flex justify-between rounded-md border border-gray-400 p-4" key={restaurant.id}>
              <div className="flex flex-col justify-between">
                <p className="text-2xl font-semibold">{restaurant.name}</p>
                <div>
                  <div className="flex items-center gap-2">
                    <MdOutlineLocationOn />
                    <p className="text-lg">{restaurant.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <GrUserWorker />
                    {restaurant.employeeCount === 0 ? <p>Aucun employé actuellement</p> : <p className="text-lg">{restaurant.employeeCount} employés</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdOutlineTableBar />
                    <p className="text-lg">{restaurant.places} places</p>
                  </div>
                </div>
              </div>
              <div className="item flex flex-col justify-center gap-2">
                <Link to={`restaurants/${restaurant.id}`} className="flex items-center justify-center gap-2 rounded-md border border-sky-600 bg-sky-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-sky-600">
                  <p>Modifier</p>
                </Link>
                <button onClick={() => openConfirmationModal(restaurant.id)} className="flex items-center justify-center gap-2 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-gray-50 duration-200 hover:bg-transparent hover:text-red-600">
                  <p>Supprimer</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div onClick={handleCloseModal} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div onClick={(e) => e.stopPropagation()} className="flex min-w-96 flex-col gap-2 rounded-md bg-white p-8">
            <h2 className="text-xl font-semibold text-gray-950">Ajouter un restaurant :</h2>
            <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
              {errorMessage && <div className="text-red-600">{errorMessage}</div>}
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="name">
                  Nom
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="name" placeholder="Nom du restaurant" onChange={handleChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="city">
                  Ville
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="text" name="city" placeholder="Ville" onChange={handleChange} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="places">
                  Nb Places
                </label>
                <input className="rounded-md border border-gray-200 bg-white p-1" type="number" name="places" placeholder="Nombre places" onChange={handleChange} min="1" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="terrace">
                  Terrasse
                </label>
                <select className="rounded-md border border-gray-200 bg-white p-1" name="terrace" placeholder="Terrasse" onChange={handleChange}>
                  <option value="">Sélectionnez</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm" htmlFor="parking">
                  Parking
                </label>
                <select className="rounded-md border border-gray-200 bg-white p-1" name="parking" placeholder="Parking" onChange={handleChange}>
                  <option value="">Sélectionnez</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
              </div>
              <div className="mt-2 flex justify-end">
                <button type="submit" className="rounded-md border-green-600 bg-green-600 px-3 py-2 text-gray-50 duration-200 hover:bg-green-600 hover:text-green-600">
                  Ajouter
                </button>
                <button type="button" onClick={handleCloseModal} className="ml-2 rounded-md border border-red-600 bg-red-600 px-3 py-2 text-gray-50 hover:bg-transparent hover:text-red-600">
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
        onConfirm={handleDelete}
        message={{
          title: "Êtes-vous sûr de vouloir supprimer ce restaurant ?",
          content: "Le restaurant ainsi que tous les employés associés seront supprimer définitivement.",
        }}
      />

      <SuccessMessage show={showSuccessMessage} message={successMessage} />
    </>
  );
}
