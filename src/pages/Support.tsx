
import { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';
import Navigation from '@/components/Navigation';

interface TicketFormData {
  subject: string;
  message: string;
  category: string;
  priority: string;
}

const Support = () => {
  const { userTickets, createTicket, addResponse, getTicketById, refreshTickets } = useTickets();
  const { user, isAuthenticated } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const form = useForm<TicketFormData>({
    defaultValues: {
      subject: '',
      message: '',
      category: 'other',
      priority: 'medium'
    }
  });

  const onSubmit = (data: TicketFormData) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const ticket = createTicket({
      subject: data.subject,
      message: data.message,
      category: data.category as any,
      priority: data.priority as any
    });

    if (ticket) {
      toast({
        title: "Тикет создан",
        description: "Ваш запрос в поддержку был отправлен. Мы ответим в ближайшее время."
      });
      setIsCreateDialogOpen(false);
      form.reset();
    }
  };

  const handleAddResponse = (ticketId: string) => {
    if (!responseMessage.trim()) return;

    const response = addResponse(ticketId, responseMessage);
    if (response) {
      setResponseMessage('');
      refreshTickets();
      toast({
        title: "Ответ отправлен",
        description: "Ваш ответ был добавлен к тикету."
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTicketData = selectedTicket ? getTicketById(selectedTicket) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Поддержка</h1>
          <p className="text-muted-foreground">Создавайте тикеты и получайте помощь от нашей команды поддержки</p>
        </div>

        {!isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle>Войдите для создания тикетов</CardTitle>
              <CardDescription>
                Для создания и отслеживания тикетов поддержки необходимо войти в систему.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAuthModal(true)}>
                Войти
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Мои тикеты</h2>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Создать
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать тикет</DialogTitle>
                      <DialogDescription>
                        Опишите вашу проблему или вопрос, и мы поможем вам.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full">
                          Создать тикет
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {userTickets.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>У вас пока нет тикетов</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  userTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className={`cursor-pointer transition-colors ${
                        selectedTicket === ticket.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm truncate">{ticket.subject}</h3>
                          <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <Badge className={`${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Ticket Detail */}
            <div className="lg:col-span-2">
              {selectedTicketData ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedTicketData.subject}</CardTitle>
                        <CardDescription>
                          Создан {new Date(selectedTicketData.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(selectedTicketData.status)}>
                          {selectedTicketData.status}
                        </Badge>
                        <Badge className={getPriorityColor(selectedTicketData.priority)}>
                          {selectedTicketData.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Original Message */}
                    <div className="bg-muted p-4 rounded-lg mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-sm">{selectedTicketData.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedTicketData.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{selectedTicketData.message}</p>
                    </div>

                    {/* Responses */}
                    <div className="space-y-4 mb-6">
                      {selectedTicketData.responses.map((response) => (
                        <div
                          key={response.id}
                          className={`p-4 rounded-lg ${
                            response.isStaff ? 'bg-primary/10 border-l-4 border-primary' : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium text-sm">{response.username}</span>
                            {response.isStaff && (
                              <Badge variant="secondary" className="text-xs">Поддержка</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Response */}
                    {selectedTicketData.status !== 'closed' && (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Добавить ответ..."
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button
                          onClick={() => handleAddResponse(selectedTicketData.id)}
                          disabled={!responseMessage.trim()}
                        >
                          Отправить ответ
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Выберите тикет для просмотра деталей</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default Support;
