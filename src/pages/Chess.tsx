
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
      <div className="relative">
        {/* Board coordinates */}
        <div className="absolute -left-6 top-0 h-full flex flex-col justify-around text-sm font-medium text-muted-foreground">
          {(isPlayerWhite ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8']).map(num => (
            <div key={num} className="h-16 flex items-center">{num}</div>
          ))}
        </div>
        <div className="absolute -bottom-6 left-0 w-full flex justify-around text-sm font-medium text-muted-foreground">
          {(isPlayerWhite ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']).map(letter => (
            <div key={letter} className="w-16 text-center">{letter}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-8 gap-0 border-4 border-border rounded-lg overflow-hidden shadow-2xl w-[512px] h-[512px] mx-auto bg-card">
          {board.map((row, rowIndex) => 
            row.map((piece, colIndex) => {
              const actualRow = isPlayerWhite ? rowIndex : 7 - rowIndex;
              const actualCol = isPlayerWhite ? colIndex : 7 - colIndex;
              const square = String.fromCharCode(97 + actualCol) + (8 - actualRow);
              const isLight = (actualRow + actualCol) % 2 === 0;
              const isSelected = selectedSquare === square;
              const possibleMoves = game?.moves({ square: selectedSquare as any, verbose: true }) || [];
              const isValidMove = possibleMoves.some(move => move.to === square);
              
              return (
                <div
                  key={`${actualRow}-${actualCol}`}
                  className={`
                    w-16 h-16 flex items-center justify-center cursor-pointer text-4xl font-bold relative
                    transition-all duration-200 hover:brightness-110
                    ${isLight 
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100' 
                      : 'bg-gradient-to-br from-amber-700 to-amber-800'
                    }
                    ${isSelected ? 'ring-4 ring-blue-500 ring-inset shadow-lg' : ''}
                    ${isValidMove ? 'ring-2 ring-green-400 ring-inset' : ''}
                  `}
                  onClick={() => handleSquareClick(square)}
                >
                  {/* Valid move indicator */}
                  {isValidMove && !piece && (
                    <div className="absolute w-4 h-4 bg-green-400 rounded-full opacity-70" />
                  )}
                  {isValidMove && piece && (
                    <div className="absolute inset-0 bg-red-400 opacity-20 rounded" />
                  )}
                  
                  {piece && (
                    <span 
                      className={`
                        drop-shadow-lg filter transition-transform hover:scale-110
                        ${piece.color === 'w' 
                          ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                          : 'text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]'
                        }
                      `}
                      style={{
                        textShadow: piece.color === 'w' 
                          ? '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.5)' 
                          : '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.5)'
                      }}
                    >
                      {getPieceSymbol(piece.type, piece.color)}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-8 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Шахматы
          </h1>

          {!gameStarted ? (
            <Card className="mb-8 max-w-2xl mx-auto shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="text-2xl text-center">Настройки игры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div>
                  <Label className="text-lg font-medium mb-4 block">
                    Уровень сложности бота (1-10):
                  </Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-full h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)} className="text-lg">
                          Уровень {i + 1} {i < 3 ? '(Легкий)' : i < 7 ? '(Средний)' : '(Сложный)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-lg font-medium mb-4 block">
                    Выберите цвет фигур:
                  </Label>
                  <RadioGroup value={playerColor} onValueChange={setPlayerColor} className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="white" id="white" className="w-5 h-5" />
                      <Label htmlFor="white" className="text-lg cursor-pointer flex items-center">
                        <span className="mr-2 text-2xl">♔</span>
                        Белые (первый ход)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="black" id="black" className="w-5 h-5" />
                      <Label htmlFor="black" className="text-lg cursor-pointer flex items-center">
                        <span className="mr-2 text-2xl">♚</span>
                        Чёрные
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={startGame} className="w-full h-12 text-lg font-semibold">
                  Начать игру
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium">Ваш цвет:</span> 
                      <span className="text-2xl">{playerColor === "white" ? "♔" : "♚"}</span>
                      <span className="font-semibold">{playerColor === "white" ? "Белые" : "Чёрные"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium">Уровень бота:</span> 
                      <span className="font-semibold text-primary">{difficulty}</span>
                    </div>
                    <Button onClick={resetGame} variant="outline" className="font-semibold">
                      Новая игра
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {gameStatus && (
                <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardContent className="p-4">
                    <div className="text-center text-xl font-bold text-primary">
                      {gameStatus}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center py-8">
                {renderBoard()}
              </div>

              {game && (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-lg">
                        <span className="font-medium">Ход:</span> 
                        <span className="ml-2 text-2xl">{game.turn() === 'w' ? '♔' : '♚'}</span>
                        <span className="ml-1 font-semibold">{game.turn() === 'w' ? 'Белые' : 'Чёрные'}</span>
                      </div>
                      {selectedSquare && (
                        <div className="text-sm text-muted-foreground">
                          Выбрана клетка: <span className="font-mono font-semibold">{selectedSquare}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chess;
