import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { listItemsStore } from "../../stores";
import ScrollList from "./ScrollList";
import "./scrollListExample.css";

/**
 * Example component to demonstrate ScrollList with MobX integration
 */
const ScrollListExample = observer(() => {
  const [seconds, setSeconds] = useState(0);
  const [autoAdd, setAutoAdd] = useState(false);
  
  // Initialize store with example items
  useEffect(() => {
    // Clear any existing items
    listItemsStore.clearItems();
    
    // Add initial items
    listItemsStore.setItems([
      "Ethereum",
      "Bitcoin",
      "Solana",
      "Polygon",
      "Avalanche",
      "Cardano",
      "Polkadot",
      "Chainlink",
      "Uniswap",
      "Cosmos",
    ]);
  }, []);
  
  // Timer for auto-adding items
  useEffect(() => {
    if (!autoAdd) return;
    
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
      
      // Add a new item every 3 seconds
      if (seconds % 3 === 0) {
        const newItem = `New Crypto ${Date.now().toString().slice(-4)}`;
        listItemsStore.addItem(newItem);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [seconds, autoAdd]);
  
  // Handle item selection
  const handleItemSelect = (item, index) => {
    console.log(`Selected: ${item} at index ${index}`);
  };
  
  // Add a random item
  const handleAddItem = () => {
    const randomNames = [
      "Algorand",
      "Tezos",
      "Stellar",
      "Near Protocol",
      "Fantom",
      "Harmony",
      "Hedera",
      "Elrond",
      "Flow",
      "Zilliqa",
    ];
    
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    const timestamp = Date.now().toString().slice(-3);
    const newItem = `${randomNames[randomIndex]}-${timestamp}`;
    
    listItemsStore.addItem(newItem);
  };
  
  // Remove the first item
  const handleRemoveFirst = () => {
    listItemsStore.removeItem(0);
  };
  
  // Clear all items
  const handleClear = () => {
    listItemsStore.clearItems();
  };
  
  return (
    <div className="scroll-list-example">
      <h2>Crypto Projects List</h2>
      <p>This example demonstrates the ScrollList with MobX integration.</p>
      
      <div className="controls">
        <button onClick={handleAddItem} className="control-button add">
          Add Random Item
        </button>
        <button onClick={handleRemoveFirst} className="control-button remove">
          Remove First
        </button>
        <button 
          onClick={() => setAutoAdd(!autoAdd)} 
          className={`control-button ${autoAdd ? 'active' : ''}`}
        >
          {autoAdd ? 'Stop Auto-Add' : 'Start Auto-Add'}
        </button>
        <button onClick={handleClear} className="control-button clear">
          Clear All
        </button>
      </div>
      
      <div className="timer">
        {autoAdd && <span>Next item in: {3 - (seconds % 3)} seconds</span>}
      </div>
      
      <div className="list-container">
        <ScrollList
          onItemSelect={handleItemSelect}
          className="demo-list"
          itemClassName="demo-item"
        />
        
        <div className="stats">
          <p>Total Items: {listItemsStore.items.length}</p>
          <p>Selected: {listItemsStore.selectedIndex >= 0 ? 
            listItemsStore.selectedIndex : 'None'}</p>
        </div>
      </div>
    </div>
  );
});

export default ScrollListExample;