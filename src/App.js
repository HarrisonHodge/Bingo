import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [bingoCard, setBingoCard] = useState([]);
  const [number, setNumber] = useState("");
  const [letter, setLetter] = useState("");
  const [calledNumbers, setCalledNumbers] = useState(new Set());
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generateBingoCard();
    newCall();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function newCall() {
    if (isGameOver) {
      alert("All numbers have been called. The game is over.");
      return;
    }

    const newLetter = generateLetter();
    generateNumber(newLetter);
  }

  function generateLetter() {
    const characters = "BINGO";
    const randomIndex = Math.floor(Math.random() * characters.length);
    const result = characters.charAt(randomIndex);

    setLetter(result);
    return result;
  }

  function generateNumber(letter) {
    let min, max;
    switch (letter) {
      case "B":
        min = 1;
        max = 15;
        break;
      case "I":
        min = 16;
        max = 30;
        break;
      case "N":
        min = 31;
        max = 45;
        break;
      case "G":
        min = 46;
        max = 60;
        break;
      case "O":
        min = 61;
        max = 75;
        break;
      default:
        return;
    }

    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (calledNumbers.has(randomNum));

    setCalledNumbers((prev) => new Set(prev).add(randomNum));
    setNumber(randomNum);

    if (calledNumbers.size >= 74) {
      setIsGameOver(true);
      setMessage("Game Over");
    }
  }

  function generateBingoCard() {
    const generateColumn = (min, max, count) => {
      const numbers = new Set();
      while (numbers.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(randomNum);
      }
      return Array.from(numbers);
    };

    const columnB = generateColumn(1, 15, 5);
    const columnI = generateColumn(16, 30, 5);
    const columnN = generateColumn(31, 45, 4);
    const columnG = generateColumn(46, 60, 5);
    const columnO = generateColumn(61, 75, 5);

    columnN.splice(2, 0, "X");

    const newBingoCard = [];
    for (let i = 0; i < 5; i++) {
      newBingoCard.push([
        columnB[i],
        columnI[i],
        columnN[i],
        columnG[i],
        columnO[i],
      ]);
    }

    setBingoCard(newBingoCard);

    const cells = document.querySelectorAll(".bingo-cell");
    cells.forEach((cell) => {
      cell.classList.remove("marker");
    });

    setCalledNumbers(new Set());
    document.body.classList.remove("rolling-rainbow");
    setIsGameOver(false);
  }

  function checkNumber(cellId) {
    const cell = document.getElementById(cellId);
    const ball = number;

    if (cell && Number(cell.textContent) === ball) {
      cell.classList.toggle("marker");
    }

    const freeSpaceId = "cell-2-2";
    const X = document.getElementById(freeSpaceId);
    if (X && X.textContent === "X") {
      X.classList.add("marker");
    }

    checkBingo();
  }

  function checkBingo() {
    for (let row = 0; row < 5; row++) {
      if (
        document.getElementById(`cell-${row}-0`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-1`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-2`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-3`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-4`).classList.contains("marker")
      ) {
        document.body.classList.add("rolling-rainbow");
        return;
      }
    }

    for (let col = 0; col < 5; col++) {
      if (
        document.getElementById(`cell-0-${col}`).classList.contains("marker") &&
        document.getElementById(`cell-1-${col}`).classList.contains("marker") &&
        document.getElementById(`cell-2-${col}`).classList.contains("marker") &&
        document.getElementById(`cell-3-${col}`).classList.contains("marker") &&
        document.getElementById(`cell-4-${col}`).classList.contains("marker")
      ) {
        document.body.classList.add("rolling-rainbow");
        return;
      }
    }

    if (
      document.getElementById("cell-0-0").classList.contains("marker") &&
      document.getElementById("cell-1-1").classList.contains("marker") &&
      document.getElementById("cell-2-2").classList.contains("marker") &&
      document.getElementById("cell-3-3").classList.contains("marker") &&
      document.getElementById("cell-4-4").classList.contains("marker")
    ) {
      document.body.classList.add("rolling-rainbow");
      return;
    }

    if (
      document.getElementById("cell-0-4").classList.contains("marker") &&
      document.getElementById("cell-1-3").classList.contains("marker") &&
      document.getElementById("cell-2-2").classList.contains("marker") &&
      document.getElementById("cell-3-1").classList.contains("marker") &&
      document.getElementById("cell-4-0").classList.contains("marker")
    ) {
      document.body.classList.add("rolling-rainbow");
      return;
    }
  }

  return (
    <div className="app">
      <div className="cursor"></div>
      <header className="header">
        <div className="spinner-container">
          <div className="spinner blue-bg">
            {letter}{number}
          </div>
        </div>
      </header>

      <main>
        <button onClick={() => newCall()}>
          <span className="button-top"> Next Ball </span>
        </button>
        <button onClick={() => generateBingoCard()}>
          <span className="button-top"> New Card </span>
        </button>
      </main>

      {message}

      <footer className="footer">
        <div className="card">
          <div className="bingo-row red-bg">
            {["B", "I", "N", "G", "O"].map((letter) => (
              <div className="bingo-cell red-bg" key={letter}>
                {letter}
              </div>
            ))}
          </div>

          <div className="bingo-card">
            {bingoCard.map((row, rowIndex) => (
              <div className="bingo-row" key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  const cellId = `cell-${rowIndex}-${cellIndex}`;
                  return (
                    <div
                      className="bingo-cell"
                      id={cellId}
                      key={cellId}
                      onClick={() => checkNumber(cellId) && !isGameOver}
                    >
                      {cell}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

const positionElement = (e) => {
  const cursorSmall = document.querySelector(".cursor");
  const mouseY = e.clientY;
  const mouseX = e.clientX;
  cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
};

window.addEventListener("mousemove", positionElement);

export default App;
