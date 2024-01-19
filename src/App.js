import './App.css';
import Die from './Die';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import React from 'react';

function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(0)
  const [time, setTime] = React.useState(0)
  
  const bestRolls = localStorage.getItem("bestRolls")
  const bestTime = localStorage.getItem("bestTime")
   
  React.useEffect(() => {
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
      if (allHeld && allSameValue) {
          setTenzies(true)
      }
  }, [dice])

  function generateNewDie() {
      return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
      }
  }
  
  function allNewDice() {
      const newDice = []
      for (let i = 0; i < 10; i++) {
          newDice.push(generateNewDie())
      }
      return newDice
  }
  
  React.useEffect(() => {
    let interval = null;

    if (!tenzies) {
      interval = setInterval(() => {
        setTime((time) => time + 10)
      }, 10)
    } else {
      if (!bestRolls) {
        localStorage.setItem("bestRolls", rolls)
        localStorage.setItem("bestTime", time)
      } else {
        if (rolls < bestRolls) {
          localStorage.setItem("bestRolls", rolls)
        }

        if (time < bestTime) {
          localStorage.setItem("bestTime", time)
        }
      }
    }

    return () => {
      clearInterval(interval)
    }

  }, [time, bestRolls, bestTime, rolls, tenzies])

  function rollDice() {
      if(!tenzies) {
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
          setRolls(prevRolls => prevRolls + 1)
      } else {
          setTenzies(false)
          setDice(allNewDice())
          setRolls(0)
          setTime(0)
      }
  }
  
  function holdDice(id) {
      setDice(oldDice => oldDice.map(die => {
          return die.id === id ? 
              {...die, isHeld: !die.isHeld} :
              die
      }))
  }
  
  const diceElements = dice.map(die => (
      <Die 
          key={die.id} 
          value={die.value} 
          isHeld={die.isHeld} 
          holdDice={() => holdDice(die.id)}
      />
  ))

  return (
    <main>
        {tenzies && <Confetti />}

        <div className="record">
          <div>BEST ROLLS: {bestRolls}</div>
          <div>BEST TIME: {("0" + Math.floor((bestTime / 60000) % 60)).slice(-2)}:
                      {("0" + Math.floor((bestTime / 1000) % 60)).slice(-2)}:
                      {("0" + ((bestTime / 10) % 100)).slice(-2)}
          </div>
        </div>

        <div className="record">
          <div>ROLLS: {rolls}</div>

          <div> TIME: {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                      {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                      {("0" + ((time / 10) % 100)).slice(-2)}
          </div>
        </div>

        <h1 className="title">TENZIES</h1>
        <p className="instructions">Roll until all dice are the same. 
        Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
            {diceElements}
        </div>
        <button 
            className="roll-dice" 
            onClick={rollDice}
        >
            {tenzies ? "New Game" : "Roll"}
        </button>
    </main>
  );
}

export default App;
