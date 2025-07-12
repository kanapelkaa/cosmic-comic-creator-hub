
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          toast({
            title: "Ошибка",
            description: "Пароли не совпадают",
            variant: "destructive"
          });
          return;
        }
        
        if (password.length < 6) {
          toast({
            title: "Ошибка",
            description: "Пароль должен содержать не менее 6 символов",
            variant: "destructive"
          });
          return;
        }
        
        const success = await register(username, email, password);
        if (success) {
          toast({
            title: "Успешно",
            description: "Регистрация прошла успешно!"
          });
          resetForm();
          onClose();
        } else {
          toast({
            title: "Ошибка",
            description: "Пользователь с таким email уже существует",
            variant: "destructive"
          });
        }
      } else {
        const success = await login(email, password);
        if (success) {
          toast({
            title: "Успешно",
            description: "Вход выполнен успешно!"
          });
          resetForm();
          onClose();
        } else {
          toast({
            title: "Ошибка",
            description: "Неверный email или пароль",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка. Попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите имя пользователя"
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                minLength={6}
              />
            </div>
            
            {mode === 'register' && (
              <div>
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Подтвердите пароль"
                  required
                  minLength={6}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? 'Загрузка...' 
                : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')
              }
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' 
                  ? 'Нет аккаунта? Зарегистрируйтесь' 
                  : 'Уже есть аккаунт? Войдите'
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
