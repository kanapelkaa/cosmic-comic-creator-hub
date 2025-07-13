import { useState, useEffect } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SupportTab = () => {
  const { tickets, updateTicketStatus, getTicketStats } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (tickets.length > 0 && !selectedTicket) {
      setSelectedTicket(tickets[0].id);
    }
  }, [tickets, selectedTicket]);

  const ticketStats = getTicketStats();

  const handleStatusUpdate = (ticketId: string, status: string) => {
    updateTicketStatus(ticketId, status as any);
    if (selectedTicket === ticketId) {
      setSelectedTicket(null);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Открыт';
      case 'in-progress': return 'В работе';
      case 'resolved': return 'Решен';
      case 'closed': return 'Закрыт';
      default: return 'Неизвестный статус';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Срочный';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестный приоритет';
    }
  };

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === statusFilter);

  const selectedTicketData = selectedTicket ? tickets.find(ticket => ticket.id === selectedTicket) : null;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Всего тикетов</CardTitle>
            <CardDescription>Общее количество созданных тикетов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats?.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Открытые</CardTitle>
            <CardDescription>Тикеты, ожидающие ответа</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats?.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>В работе</CardTitle>
            <CardDescription>Тикеты, над которыми работают</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats?.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Решенные</CardTitle>
            <CardDescription>Тикеты, которые были решены</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats?.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Все тикеты</h3>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="open">Открытые</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="resolved">Решенные</SelectItem>
                <SelectItem value="closed">Закрытые</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Нет тикетов для отображения</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTicket === ticket.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm truncate">{ticket.subject}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{ticket.username}</span>
                          {ticket.isGuest && (
                            <Badge variant="outline" className="text-xs">Гость</Badge>
                          )}
                        </div>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <Badge className={`${getPriorityColor(ticket.priority)}`}>
                        {getPriorityText(ticket.priority)}
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
                      {getStatusText(selectedTicketData.status)}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicketData.priority)}>
                      {getPriorityText(selectedTicketData.priority)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Сообщение:</h4>
                  <p className="text-sm">{selectedTicketData.message}</p>
                </div>

                <div className="flex justify-between">
                  <Select onValueChange={(value) => handleStatusUpdate(selectedTicketData.id, value)} defaultValue={selectedTicketData.status}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Изменить статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Открыть</SelectItem>
                      <SelectItem value="in-progress">В работу</SelectItem>
                      <SelectItem value="resolved">Решить</SelectItem>
                      <SelectItem value="closed">Закрыть</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
    </div>
  );
};
