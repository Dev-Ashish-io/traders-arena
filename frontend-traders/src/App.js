import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import './index.css';  // Importing CSS

const App = () => {
  const [teams, setTeams] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // success or error

  // Set the backend URL for production (deployed backend)
  const backendUrl = "https://backend-0qxg.onrender.com";

  // Establish the WebSocket connection with the backend
  const socket = io(backendUrl);

  // Fetch teams from the backend
  useEffect(() => {
    axios
      .get(`${backendUrl}/teams`)  // Update with your Flask backend endpoint
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        alert("Error fetching teams: " + error.response.data.error); // Display error message
      });

    // Set up real-time updates using WebSocket
    socket.on("update", (newData) => {
      setTeams(newData.teams); // Assuming the backend sends 'teams' in the update
    });

    // Cleanup function to disconnect the socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch transactions from the backend
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/transactions`)  // Update with your Flask backend endpoint
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        alert("Error fetching transactions: " + error.response.data.error); // Display error message
      });
  }, []);

  // Handle form submit to create a new transaction
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      name: e.target.transactionName.value,
      amount: e.target.transactionAmount.value,
    };

    axios
      .post(`${backendUrl}/api/transactions`, newTransaction)  // Update with your Flask backend endpoint
      .then((response) => {
        console.log("Transaction added:", response.data);
        setTransactions([...transactions, response.data]); // Update state with new transaction
        setModalMessage("Transaction added successfully!");
        setModalType("success");
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
        setModalMessage("Error adding transaction. Please try again.");
        setModalType("error");
        setIsModalOpen(true);
      });
  };

  // Close modal handler
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-semibold text-center my-8 text-yellow-300">Teams</h1>
      <div className="teams-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
        {teams.map((team) => (
          <div
            key={team.id}
            className="team-card p-6 bg-white shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-100 cursor-pointer"
            tabIndex="0"
            aria-label={`Team: ${team.name}`}
          >
            <h3 className="font-semibold text-xl mb-4 text-blue-500">{team.name}</h3>
            <p className="text-gray-700">Money: ${team.money.toFixed(2)}</p>
            <p className="text-gray-700">Stocks: {JSON.stringify(team.stocks)}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold text-center my-8 text-yellow-300">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="text-white">
            {transaction.name} - ${transaction.amount}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold text-center my-8 text-yellow-300">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-lg">
        <div>
          <label htmlFor="transactionName" className="block text-white font-semibold">Transaction Name:</label>
          <input
            type="text"
            id="transactionName"
            name="name"
            className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="transactionAmount" className="block text-white font-semibold">Amount:</label>
          <input
            type="number"
            id="transactionAmount"
            name="amount"
            className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit Transaction
        </button>
      </form>

      {/* Modal for success/error */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div
            className={`p-8 rounded shadow-md max-w-sm bg-white ${
              modalType === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">{modalType === "success" ? "Success!" : "Error!"}</h2>
            <p>{modalMessage}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
