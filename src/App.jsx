import React, { useState, useEffect } from "react";
import "./App.css";

const generateRandomNumber = () => Math.floor(Math.random() * 1000) + 1;

function App() {
  const [wallet, setWallet] = useState(100);
  const [bet, setBet] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [boxes, setBoxes] = useState(Array(20).fill(null));
  const [currentNumber, setCurrentNumber] = useState(null);
  const [round, setRound] = useState(0);
  const [possiblePositions, setPossiblePositions] = useState([]);

  useEffect(() => {
    if (gameStarted) {
      const positions = getPossiblePositions();
      setPossiblePositions(positions);
      if (positions.length === 0) {
        loseGame();
      }
    }
  }, [currentNumber, gameStarted, boxes]);

  const startGame = () => {
    if (bet <= 0 || bet > wallet) {
      alert("Invalid bet amount");
      return;
    }
    setWallet(wallet - bet);
    setGameStarted(true);
    setCurrentNumber(generateRandomNumber());
    setBoxes(Array(20).fill(null));
    setRound(0);
  };

  const getPossiblePositions = () => {
    let minIndex = -1;
    let maxIndex = 20;

    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i] !== null && boxes[i] < currentNumber) {
        minIndex = i;
      }
      if (boxes[i] !== null && boxes[i] > currentNumber && maxIndex === 20) {
        maxIndex = i;
      }
    }

    const positions = [];
    for (let i = minIndex + 1; i < maxIndex; i++) {
      if (boxes[i] === null) {
        positions.push(i);
      }
    }
    return positions;
  };

  const placeNumber = (index) => {
    if (!possiblePositions.includes(index)) {
      alert("Invalid position");
      return;
    }

    const newBoxes = [...boxes];
    newBoxes[index] = currentNumber;
    setBoxes(newBoxes);
    setRound(round + 1);
    setCurrentNumber(generateRandomNumber());
  };

  const stopGame = () => {
    const payout = bet * (1 + round / 10);
    setWallet(wallet + payout);
    resetGame();
  };

  const loseGame = () => {
    alert("You lost!");
    resetGame();
  };

  const resetGame = () => {
    setGameStarted(false);
    setBet(0);
    setCurrentNumber(null);
    setPossiblePositions([]);
  };

  return (
    <div className="App">
      <h1>Gambling Game</h1>
      <p>Wallet: ${wallet.toFixed(2)}</p>
      {gameStarted ? (
        <div>
          <p>Current Bet: ${bet}</p>
          <p>Round: {round}</p>
          <p>Current Number: {currentNumber}</p>
          <p>Potential Payout: ${(bet * (1 + round / 10)).toFixed(2)}</p>
          <div className="boxes">
            {boxes.map((box, index) => (
              <div
                key={index}
                className={`box ${
                  possiblePositions.includes(index) ? "highlight" : ""
                }`}
                onClick={() => placeNumber(index)}
              >
                {box !== null ? box : "-"}
              </div>
            ))}
          </div>
          <button onClick={stopGame}>Stop Game and Cash Out</button>
        </div>
      ) : (
        <div>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            placeholder="Enter bet amount"
          />
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
    </div>
  );
}

export default App;
