import "./App.scss";
import React, { useState, useEffect } from "react";

function App() {
  const [counter, setCounter] = useState(null);
  const [bingoCard, setBingoCard] = useState([]);
  const [pastBalls, setPastBalls] = useState([]);
  const [number, setNumber] = useState("");
  const [letter, setLetter] = useState("");
  const [message, setMessage] = useState("");
  const [calledNumbers, setCalledNumbers] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bingo, setBingo] = useState(false);

  useEffect(() => {
    clear();
    generateBingoCard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!bingoCard.length) return;

    const cells = document.querySelectorAll(".bingo-cell");
    cells.forEach((cell) => {
      cell.classList.remove("marker");
    });
  }, [bingoCard]);

  const handleBallAnimation = () => {
    const ball = document.getElementById("ball");
    setIsAnimating(true);

    ball.classList.add("animate");

    ball.addEventListener(
      "animationend",
      () => {
        ball.classList.remove("animate");
        setIsAnimating(false);
      },
      { once: true }
    );
  };

  const newCall = () => {
    setCounter((prev) => prev - 1);
    const newLetter = generateLetter();
    generateNumber(newLetter);
  };

  const clear = () => {
    document.body.classList.remove("rolling-rainbow");
    setCounter(50);
    setCalledNumbers(new Set());
    setPastBalls([]);
    setLetter("");
    setNumber("");
    setMessage("");
    setGameOver(false);
    setBingo(false);
    generateBingoCard();
    newCall();
  };

  const generateLetter = () => {
    const characters = "BINGO";
    const randomIndex = Math.floor(Math.random() * characters.length);
    const result = characters.charAt(randomIndex);

    setLetter(result);
    return result;
  };

  const generateNumber = (letter) => {
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

    setPastBalls((prev) => {
      const updated = [...prev, `${letter}${randomNum}`];
      return updated.length >= 5 ? updated.slice(-5) : updated;
    });
  };

  const generateBingoCard = () => {
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
  };

  const checkGameOver = () => {
    if (counter < 0) {
      setMessage('game over')
      setGameOver(true)
    } 
    else if (calledNumbers.size > 49) {
      setMessage('game over')
      setGameOver(true)
    } 
    else {
      setMessage('')
      setGameOver(false)
      if (!bingo) {
        handleBallAnimation();
        newCall();
      }
    }
  };

  const checkNumber = (cellId) => {
    if (gameOver || number === "") return;

    const cell = document.getElementById(cellId);
    if (
      cell &&
      (Number(cell.textContent) === number ||
        calledNumbers.has(Number(cell.textContent)))
    ) {
      cell.classList.add("marker");
      checkBingo();
      if (!bingo || !gameOver) {
        handleBallAnimation();
        checkGameOver();
      }
    }

    const freeSpaceId = "cell-2-2";
    const X = document.getElementById(freeSpaceId);
    if (X && X.textContent === "X") {
      X.classList.add("marker");
    }
  };

  const checkBingo = () => {
    for (let row = 0; row < 5; row++) {
      if (
        document.getElementById(`cell-${row}-0`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-1`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-2`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-3`).classList.contains("marker") &&
        document.getElementById(`cell-${row}-4`).classList.contains("marker")
      ) {
        setBingo(true);
        setMessage("BINGO!");
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
        setBingo(true);
        setMessage("BINGO!");
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
      setBingo(true);
      setMessage("BINGO!");
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
      setBingo(true);
      setMessage("BINGO!");
      document.body.classList.add("rolling-rainbow");
      return;
    }
  };

  return (
    <div className="app">
      <div className="cursor"></div>
      <header
        className="header"
        id="header"
        onClick={() => {
          if ((!gameOver || !bingo) && !isAnimating) {
            checkGameOver();
          }
        }}
      >
        <div className="ball-container">
          {pastBalls.slice(0, -1).map((ball, index) => (
            <div tabIndex="0" key={index} className="dropped-ball blue-bg">
              {ball}
            </div>
          ))}
          <div tabIndex="0" id="ball" className="ball blue-bg">
            {letter}
            {number}
          </div>
        </div>
      </header>

      <main className="game-over">
        {gameOver &&(
          <div>
            {message}
            <button onClick={() => clear()}>New Game?</button>
          </div>
        )}
        {bingo && (
          <div>
            <div className="center">
              <ul className="c-rainbow">
                <li className="c-rainbow__layer c-rainbow__layer--white">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--orange">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--red">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--violet">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--blue">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--green">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--yellow">
                  BINGO!
                </li>
              </ul>
              <ul className="c-rainbow">
                <li className="c-rainbow__layer c-rainbow__layer--white">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--orange">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--red">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--violet">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--blue">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--green">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--yellow">
                  BINGO!
                </li>
              </ul>
              <ul className="c-rainbow">
                <li className="c-rainbow__layer c-rainbow__layer--white">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--orange">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--red">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--violet">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--blue">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--green">
                  BINGO!
                </li>
                <li className="c-rainbow__layer c-rainbow__layer--yellow">
                  BINGO!
                </li>
              </ul>
            </div>
            <button onClick={() => clear()}>New Game?</button>
          </div>
        )}
      </main>

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
                      onClick={() => checkNumber(cellId) && !gameOver}
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
      <p className="counter">balls left: {counter}</p>
    </div>
  );
}

const positionElement = (e) => {
  const cursorSmall = document.querySelector(".cursor");
  const mouseY = e.clientY;
  const mouseX = e.clientX;
  cursorSmall.style.transform = `translate3d(${mouseX - 25}px, ${
    mouseY - 25
  }px, 0)`;
};

window.addEventListener("mousemove", positionElement);

export default App;
