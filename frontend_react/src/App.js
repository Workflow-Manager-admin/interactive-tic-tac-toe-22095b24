import React, { useState, useEffect } from "react";
import "./App.css";

// Theme colors based on the project brief
const COLORS = {
  primary: "#1976d2", // blue, player X
  secondary: "#ffffff", // white/light background
  accent: "#ff9800", // orange, highlight winner
  gridBorder: "#e0e0e0"
};

/**
 * Returns an array [winner, winningLineIndices] if a player has won.
 * Otherwise returns [null, null].
 * @param {Array} squares 3x3 flat board, string[] with "X", "O", or null
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return [squares[a], line];
    }
  }
  return [null, null];
}

// PUBLIC_INTERFACE
function App() {
  // "X" goes first
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]); // to support "new game"
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [theme] = useState("light"); // Fixed theme for now; can extend for toggling

  // Effect: track winner and game over state
  useEffect(() => {
    const [maybeWinner, line] = calculateWinner(squares);
    if (maybeWinner) {
      setWinner(maybeWinner);
      setIsGameOver(true);
      setWinningLine(line);
    } else if (squares.every(Boolean)) {
      setWinner(null);
      setWinningLine(null);
      setIsGameOver(true); // Draw, all filled
    } else {
      setWinner(null);
      setWinningLine(null);
      setIsGameOver(false);
    }
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || isGameOver) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setHistory([...history, squares]);
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine(null);
    setIsGameOver(false);
    setHistory([]);
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    if (history.length > 0) {
      handleReset();
    }
  }

  // Status message
  let status;
  if (winner) {
    status = (
      <span>
        <strong style={{ color: COLORS.accent }}>{winner}</strong> wins!
      </span>
    );
  } else if (isGameOver) {
    status = <span style={{ color: COLORS.primary }}>It's a draw!</span>;
  } else {
    status = (
      <span>
        Next:{" "}
        <strong
          style={{
            color: xIsNext ? COLORS.primary : COLORS.accent
          }}
        >
          {xIsNext ? "X" : "O"}
        </strong>
      </span>
    );
  }

  // Board rendering helpers
  function renderSquare(i) {
    const isWinnerSquare =
      winningLine && winningLine.includes(i) && winner != null;
    return (
      <button
        key={i}
        className="ticcell"
        onClick={() => handleClick(i)}
        aria-label={`cell ${i}`}
        style={{
          color:
            squares[i] === "X"
              ? COLORS.primary
              : squares[i] === "O"
                ? COLORS.accent
                : "#374151",
          borderColor: isWinnerSquare
            ? COLORS.accent
            : COLORS.gridBorder,
          background: isWinnerSquare
            ? "#fffbe8"
            : COLORS.secondary,
          fontWeight: isWinnerSquare ? 700 : 600
        }}
        disabled={!!squares[i] || isGameOver}
      >
        {squares[i]}
      </button>
    );
  }

  // PUBLIC_INTERFACE: main render
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: COLORS.secondary,
        color: COLORS.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
      data-theme={theme}
    >
      <div className="tictactoe-container">
        <h1 className="ttt-title" style={{ color: COLORS.primary, marginBottom: 0 }}>
          Tic Tac Toe
        </h1>
        <div
          className="ttt-statusbar"
          style={{
            margin: "16px 0",
            fontSize: "1.25rem",
            minHeight: "1.5rem",
            textAlign: "center",
            letterSpacing: 1
          }}
          aria-live="polite"
        >
          {status}
        </div>
        <div className="ttt-board">
          {[0, 1, 2].map(row =>
            <div className="ttt-row" key={row}>
              {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
            </div>
          )}
        </div>
        <div style={{ margin: "2rem 0 0.5rem 0", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <button
            className="ttt-btn"
            style={{
              background: COLORS.primary,
              color: "#fff"
            }}
            onClick={handleReset}
            aria-label="Reset the current board"
            disabled={!isGameOver && squares.every(s => !s)}
          >
            Reset
          </button>
          <button
            className="ttt-btn"
            style={{
              background: COLORS.accent,
              color: "#fff"
            }}
            onClick={handleNewGame}
            aria-label="Start a new game"
            disabled={!isGameOver}
          >
            New Game
          </button>
        </div>
        <footer className="ttt-footer" style={{ marginTop: 14, fontSize: 12, color: "#8e99a7", textAlign: "center" }}>
          <span>
            <span style={{ color: COLORS.primary, fontWeight: 500 }}>2-Player</span>{" "}
            local game &middot; Modern, minimal UI
          </span>
        </footer>
      </div>
      {/* Embedded minimal CSS for Tic Tac Toe below */}
      <style>{`
      .tictactoe-container {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 4px 26px 0 rgba(25, 118, 210, 0.10);
        padding: 32px 18px 22px 18px;
        min-width: 320px;
        max-width: 380px;
        width: 95vw;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .ttt-title {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        letter-spacing: 1px;
        font-size: 2.1rem;
      }
      .ttt-board {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 0;
        margin-top: 6px;
      }
      .ttt-row {
        display: flex;
      }
      .ticcell {
        width: 66px;
        height: 66px;
        margin: 3px;
        font-size: 2rem;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-weight: 700;
        background: #fff;
        border: 2.5px solid ${COLORS.gridBorder};
        border-radius: 13px;
        cursor: pointer;
        transition: border-color 0.2s, background 0.17s;
        box-shadow: 0 1.5px 8px 0 rgba(0,0,0,0.045);
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        transition: box-shadow 0.15s, border-color 0.14s;
      }
      .ticcell:hover:not(:disabled) {
        border-color: ${COLORS.primary};
        background: #f6fbff;
        box-shadow: 0 4px 13px 0 rgba(25, 118, 210, 0.10);
      }
      .ticcell:disabled {
        cursor: default;
        opacity: 0.825;
      }
      .ttt-btn {
        padding: 0.65em 2.1em;
        border: none;
        border-radius: 9px;
        font-size: 1.08em;
        font-family: inherit;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 6px 0 rgba(25, 118, 210, 0.08);
      }
      .ttt-btn:active {
        opacity: 0.92;
        box-shadow: 0 2px 18px 0 rgba(255, 152, 0, 0.08);
      }
      .ttt-btn:disabled {
        background: #e4e9f0 !important;
        color: #bbb !important;
        cursor: default;
        box-shadow: none; 
      }

      @media (max-width: 500px) {
        .tictactoe-container {
          padding: 13px 2px 14px 2px;
          min-width: unset;
        }
        .ticcell {
          width: 19vw;
          min-width: 46px;
          max-width: 68px;
          height: 19vw;
          min-height: 46px;
          max-height: 68px;
          font-size: 1.1rem;
        }
        .ttt-title {
          font-size: 1.28rem;
        }
      }
      `}
      </style>
    </div>
  );
}

export default App;
