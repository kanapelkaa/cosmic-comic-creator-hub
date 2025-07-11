
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

// Tetris pieces (tetrominoes)
const PIECES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-500'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-500'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'bg-purple-500'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'bg-green-500'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'bg-red-500'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'bg-blue-500'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'bg-orange-500'
  }
};

const createEmptyBoard = () => 
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(EMPTY_CELL));

const TetrisGame = () => {
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [dropTime, setDropTime] = useState(1000);

  const getRandomPiece = () => {
    const pieceKeys = Object.keys(PIECES);
    const randomKey = pieceKeys[Math.floor(Math.random() * pieceKeys.length)];
    return { ...PIECES[randomKey], type: randomKey };
  };

  const rotatePiece = (piece) => {
    const rotated = piece[0].map((_, index) =>
      piece.map(row => row[index]).reverse()
    );
    return rotated;
  };

  const isValidMove = (piece, position, boardState = board) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (
            newX < 0 || 
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && boardState[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = () => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPosition.y + y;
          const boardX = currentPosition.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }
    
    return newBoard;
  };

  const clearLines = (boardState) => {
    const newBoard = [];
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (boardState[y].every(cell => cell !== EMPTY_CELL)) {
        linesCleared++;
      } else {
        newBoard.unshift(boardState[y]);
      }
    }
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }
    
    return { board: newBoard, linesCleared };
  };

  const spawnNewPiece = () => {
    const newPiece = getRandomPiece();
    const startPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    
    if (!isValidMove(newPiece.shape, startPosition)) {
      setGameOver(true);
      return;
    }
    
    setCurrentPiece(newPiece);
    setCurrentPosition(startPosition);
  };

  const movePiece = (direction) => {
    if (!currentPiece || gameOver) return;
    
    const newPosition = { ...currentPosition };
    
    switch (direction) {
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
    }
    
    if (isValidMove(currentPiece.shape, newPosition)) {
      setCurrentPosition(newPosition);
    } else if (direction === 'down') {
      const newBoard = placePiece();
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      
      spawnNewPiece();
    }
  };

  const rotatePieceHandler = () => {
    if (!currentPiece || gameOver) return;
    
    const rotated = rotatePiece(currentPiece.shape);
    if (isValidMove(rotated, currentPosition)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  };

  const handleKeyPress = useCallback((event) => {
    if (!gameStarted || gameOver) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        movePiece('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        movePiece('right');
        break;
      case 'ArrowDown':
        event.preventDefault();
        movePiece('down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        rotatePieceHandler();
        break;
    }
  }, [currentPiece, currentPosition, gameStarted, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      movePiece('down');
    }, dropTime);
    
    return () => clearInterval(interval);
  }, [currentPiece, currentPosition, dropTime, gameStarted, gameOver]);

  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
    }
  }, [lines, level]);

  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setGameStarted(true);
    setDropTime(1000);
    spawnNewPiece();
  };

  const resetGame = () => {
    setGameStarted(false);
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  const getCellColor = (cellValue) => {
    if (cellValue === EMPTY_CELL) return 'bg-gray-800 border border-gray-700';
    return PIECES[cellValue]?.color || 'bg-gray-500';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Game Board */}
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-10 gap-0 border-2 border-gray-600 bg-gray-900 p-2">
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`w-6 h-6 ${getCellColor(cell)}`}
                />
              ))
            )}
          </div>
          
          {/* Controls */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Use arrow keys to play:</p>
            <p>← → to move, ↓ to drop, ↑ to rotate</p>
          </div>
        </div>
        
        {/* Game Info */}
        <div className="flex flex-col gap-4 min-w-48">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Score</h3>
            <p className="text-2xl font-mono">{score.toLocaleString()}</p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Level</h3>
            <p className="text-xl font-mono">{level}</p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Lines</h3>
            <p className="text-xl font-mono">{lines}</p>
          </div>
          
          {/* Game Controls */}
          <div className="flex flex-col gap-2">
            {!gameStarted ? (
              <Button onClick={startGame} size="lg">
                Start Game
              </Button>
            ) : (
              <>
                {gameOver && (
                  <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive">
                    <p className="text-lg font-bold text-destructive mb-2">Game Over!</p>
                    <p className="text-sm">Final Score: {score.toLocaleString()}</p>
                  </div>
                )}
                <Button onClick={resetGame} variant="outline">
                  New Game
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
