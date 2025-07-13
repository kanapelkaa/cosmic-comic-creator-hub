
import Navigation from "@/components/Navigation";
import { Mail, MessageCircle, Users, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { ticketStorage } from "@/services/ticketStorage";

interface GuestTicketFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
}

const Index = () => {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

  const form = useForm<GuestTicketFormData>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'other',
      priority: 'medium'
    }
  });

  const onSubmit = (data: GuestTicketFormData) => {
    const ticket = ticketStorage.createGuestTicket({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      category: data.category as any,
      priority: data.priority as any
    });

    if (ticket) {
      toast({
        title: "Тикет создан",
        description: "Ваш запрос отправлен. Мы ответим на указанный email."
      });
      setIsTicketDialogOpen(false);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/30"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 via-transparent to-primary/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <Navigation />
      
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="text-center text-foreground px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Cosmic Comic Hub 
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in text-muted-foreground">
            Добро пожаловать в мою творческую вселенную, где истории оживают благодаря искусству и воображению.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <a 
              href="/comics" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              Изучать комиксы
            </a>
            <a 
              href="/about" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              Обо мне
            </a>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-center mb-4 text-card-foreground">
              Контакты 
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://t.me/snakwnzzz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-all hover:scale-105 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">@snakwnzzz</span>
              </a>
              <a 
                href="https://discord.com/users/kanapel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 group"
              >
                <Users className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">@kanapel</span>
              </a>
              <a 
                href="mailto:kanapelkaaa@gmail.com"
                className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 group"
              >
                <Mail className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-medium">kanapelkaaa@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
            size="icon"
          >
            <HelpCircle className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Связаться с поддержкой</DialogTitle>
            <DialogDescription>
              Опишите вашу проблему или вопрос, и мы свяжемся с вами.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Ваше имя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тема</FormLabel>
                    <FormControl>
                      <Input placeholder="Краткое описание проблемы" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">Техническая проблема</SelectItem>
                        <SelectItem value="billing">Биллинг</SelectItem>
                        <SelectItem value="feature-request">Запрос функции</SelectItem>
                        <SelectItem value="bug-report">Сообщение об ошибке</SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Приоритет</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите приоритет" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Низкий</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="high">Высокий</SelectItem>
                        <SelectItem value="urgent">Срочный</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сообщение</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробно опишите вашу проблему или вопрос..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Отправить запрос
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
