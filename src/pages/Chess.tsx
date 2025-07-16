
import React, { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Chess as ChessJS } from "chess.js";
import { toast } from "@/hooks/use-toast";

const Chess = () => {
  const [game, setGame] = useState<ChessJS | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("5");
  const [playerColor, setPlayerColor] = useState("white");
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState("");

  const startGame = () => {
    const newGame = new ChessJS();
    setGame(newGame);
    setGameStarted(true);
    setSelectedSquare(null);
    setGameStatus("Игра началась!");
    
    // If player chose black, make bot move first
    if (playerColor === "black") {
      setTimeout(() => makeBotMove(newGame), 500);
    }
  };

  const makeBotMove = (currentGame: ChessJS) => {
    const possibleMoves = currentGame.moves();
    if (possibleMoves.length === 0) return;

    // Simple bot logic based on difficulty
    let selectedMove;
    const difficultyNum = parseInt(difficulty);
    
    if (difficultyNum <= 3) {
      // Easy: Random move
      selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else if (difficultyNum <= 7) {
      // Medium: Prefer captures
      const captures = possibleMoves.filter(move => move.includes('x'));
      selectedMove = captures.length > 0 && Math.random() > 0.3 
        ? captures[Math.floor(Math.random() * captures.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else {
      // Hard: Prefer captures and checks
      const captures = possibleMoves.filter(move => move.includes('x'));
      const checks = possibleMoves.filter(move => move.includes('+'));
      const goodMoves = [...captures, ...checks];
      selectedMove = goodMoves.length > 0 && Math.random() > 0.2
        ? goodMoves[Math.floor(Math.random() * goodMoves.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    try {
      currentGame.move(selectedMove);
      setGame(new ChessJS(currentGame.fen()));
      
      if (currentGame.isGameOver()) {
        if (currentGame.isCheckmate()) {
          setGameStatus("Бот выиграл! Мат!");
        } else if (currentGame.isDraw()) {
          setGameStatus("Ничья!");
        }
      }
    } catch (error) {
      console.error("Bot move error:", error);
    }
  };

  const handleSquareClick = (square: string) => {
    if (!game || !gameStarted) return;

    if (selectedSquare === null) {
      // Select piece if it belongs to current player
      const piece = game.get(square as any);
      if (piece && piece.color === (playerColor === "white" ? "w" : "b")) {
        setSelectedSquare(square);
      }
    } else {
      // Try to make move
      try {
        const move = game.move({
          from: selectedSquare as any,
          to: square as any,
          promotion: 'q' // Always promote to queen for simplicity
        });

        if (move) {
          const newGame = new ChessJS(game.fen());
          setGame(newGame);
          setSelectedSquare(null);

          if (newGame.isGameOver()) {
            if (newGame.isCheckmate()) {
              setGameStatus("Вы выиграли! Мат!");
            } else if (newGame.isDraw()) {
              setGameStatus("Ничья!");
            }
          } else {
            // Bot's turn
            setTimeout(() => makeBotMove(newGame), 500);
          }
        } else {
          setSelectedSquare(null);
        }
      } catch (error) {
        setSelectedSquare(null);
      }
    }
  };

  const resetGame = () => {
    setGame(null);
    setGameStarted(false);
    setSelectedSquare(null);
    setGameStatus("");
  };

  const renderBoard = () => {
    if (!game) return null;

    const board = game.board();
    const isPlayerWhite = playerColor === "white";
    
    return (
      <div className="grid grid-cols-8 gap-0 border-2 border-border w-96 h-96 mx-auto">
        {board.map((row, rowIndex) => 
          row.map((piece, colIndex) => {
            const actualRow = isPlayerWhite ? rowIndex : 7 - rowIndex;
            const actualCol = isPlayerWhite ? colIndex : 7 - colIndex;
            const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
            const isLight = (actualRow + actualCol) % 2 === 0;
            const isSelected = selectedSquare === square;
            
            return (
              <div
                key={`${actualRow}-${actualCol}`}
                className={`
                  w-12 h-12 flex items-center justify-center cursor-pointer text-2xl font-bold
                  ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                  ${isSelected ? 'ring-4 ring-blue-500' : ''}
                  hover:opacity-80
                `}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <span className={piece.color === 'w' ? 'text-white' : 'text-black'}>
                    {getPieceSymbol(piece.type, piece.color)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  const getPieceSymbol = (type: string, color: string) => {
    const pieces = {
      'p': color === 'w' ? '♙' : '♟',
      'r': color === 'w' ? '♖' : '♜',
      'n': color === 'w' ? '♘' : '♞',
      'b': color === 'w' ? '♗' : '♝',
      'q': color === 'w' ? '♕' : '♛',
      'k': color === 'w' ? '♔' : '♚',
    };
    return pieces[type as keyof typeof pieces] || '';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">
            Шахматы
          </h1>

          {!gameStarted ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Настройки игры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Уровень сложности бота (1-10):
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          Уровень {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Выберите цвет фигур:
                  </Label>
                  <RadioGroup value={playerColor} onValueChange={setPlayerColor}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="white" id="white" />
                      <Label htmlFor="white">Белые (первый ход)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="black" id="black" />
                      <Label htmlFor="black">Чёрные</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={startGame} className="w-full">
                  Начать игру
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="text-lg">
                  <span className="font-medium">Ваш цвет:</span> {playerColor === "white" ? "Белые" : "Чёрные"}
                </div>
                <div className="text-lg">
                  <span className="font-medium">Уровень бота:</span> {difficulty}
                </div>
                <Button onClick={resetGame} variant="outline">
                  Новая игра
                </Button>
              </div>

              {gameStatus && (
                <div className="text-center text-lg font-medium text-primary">
                  {gameStatus}
                </div>
              )}

              <div className="flex justify-center">
                {renderBoard()}
              </div>

              {game && (
                <div className="text-center text-sm text-muted-foreground">
                  Ход: {game.turn() === 'w' ? 'Белые' : 'Чёрные'}
                  {selectedSquare && (
                    <span className="ml-4">Выбрана клетка: {selectedSquare}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chess;
