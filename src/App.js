import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from './abi';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (address && signer) {
      loadTasks();
    }
  }, [address, signer, reload]);

  

  const loadTasks = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tasks = await contract.getTasksByOwner(address);
      setTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = window.ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      setSigner(signer);

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet", error);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setTasks([]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.createTask(taskDescription, taskPriority);
      loadTasks();
      setTaskDescription("");
      setTaskPriority(0);
      setReload(!reload);
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const removeTask = async (taskId) => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.removeTask(taskId);
      setReload(!reload);
      loadTasks();
    } catch (error) {
      console.error("Error removing task", error);
    }
  };

  return (
    <div className="App" style={{background: '#f0f0f0', color: '#333', minHeight: '100vh'}}>
      <header className="App-header">
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px', 
          padding: '10px', 
          background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
          color: 'white'
        }}>
          <div style={{fontSize: '2rem', fontWeight: 'bold'}}>
            TODO List DAPP
            <p style={{fontSize: '1rem'}}>A personalized to-do list for every wallet</p>
          </div>
          {address ? (
            <><p>Connected: {address}</p>
            <button onClick={disconnectWallet} style={{backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Disconnect Wallet</button>
            </>
          ) : (
            <button onClick={connectWallet} style={{backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Connect Wallet</button>
          )}
        </div>
        
        {address && (
          <form onSubmit={addTask} style={{marginBottom: '20px'}}>
            <input
              type="text"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              style={{padding: '10px', marginRight: '10px'}}
            />
            <label style={{marginLeft: '10px'}}>
              Priority:
              <input
                type="number"
                placeholder="0"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                style={{padding: '10px', marginLeft: '10px'}}
              />
            </label>
            <button type="submit" style={{backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', marginLeft: '10px'}}>Add Task</button>
          </form>
        )}
        
        <div className="task-container">
          {tasks.map((task, index) => (
            <div key={index} className="task-card" style={{
              background: 'linear-gradient(to right, #a8e063, #56ab2f)',
              padding: '10px', 
              margin: '10px', 
              borderRadius: '5px',
              color: 'white'
            }}>
              <p>{task.description} - Priority: {task.priority.toString()}</p>
              <button onClick={() => removeTask(task.id)} style={{backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Remove Task</button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
