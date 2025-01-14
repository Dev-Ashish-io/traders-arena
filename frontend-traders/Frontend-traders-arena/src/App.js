import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const App = () => {
  const [teams, setTeams] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Establish the WebSocket connection
  const socket = io("https://backend-0qxg.onrender.com");

  // Fetch teams from the backend
  useEffect(() => {
    axios
      .get("https://backend-0qxg.onrender.com")  // Replace with your Flask backend endpoint
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
      .get("https://backend-0qxg.onrender.com")  // Replace with your Flask backend endpoint
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
      name: "Transaction 1",
      amount: 1000,
    };

    axios
      .post("https://backend-0qxg.onrender.com", newTransaction)  // Replace with your Flask backend endpoint
      .then((response) => {
        console.log("Transaction added:", response.data);
        setTransactions([...transactions, response.data]); // Update state with new transaction
      })
      .catch((error) => {
        alert("Error adding transaction: " + error.response.data.error); // Display error message
      });
  };

  return (
    <div className="App">
      <h1>Teams</h1>
      <div className="teams-container">
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

      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.name} - ${transaction.amount}
          </li>
        ))}
      </ul>

      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="transactionName">Transaction Name:</label>
          <input type="text" id="transactionName" name="name" required />
        </div>
        <div>
          <label htmlFor="transactionAmount">Amount:</label>
          <input type="number" id="transactionAmount" name="amount" required />
        </div>
        <button type="submit">Submit Transaction</button>
      </form>
    </div>
  );
};

export default App;
