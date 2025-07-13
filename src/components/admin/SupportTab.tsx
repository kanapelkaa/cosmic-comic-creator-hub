
import { useState } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, User, Clock, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Ticket } from '@/services/ticketStorage';

const SupportTab = () => {
  const { tickets, updateTicketStatus, addResponse, getTicketById, refreshTickets, getTicketStats } = useTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getTicketStats();
  const selectedTicket = selectedTicketId ? getTicketById(selectedTicketId) : null;

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
    const updated = updateTicketStatus(ticketId, newStatus);
    if (updated) {
      toast({
        title: "Статус обновлен",
        description: `Статус тикета изменен на "${newStatus}"`
      });
    }
  };

  const handleAddResponse = () => {
    if (!selectedTicket || !responseMessage.trim()) return;

    const response = addResponse(selectedTicket.id, responseMessage);
    if (response) {
      setResponseMessage('');
      toast({
        title: "Ответ отправлен",
        description: "Ваш ответ был добавлен к тикету."
      });
      // Auto-update status to in-progress if it was open
      if (selectedTicket.status === 'open') {
        handleStatusChange(selectedTicket.id, 'in-progress');
      }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего тикетов</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Открытые</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Решенные</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Срочные</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по теме или пользователю..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="open">Открытые</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="resolved">Решенные</SelectItem>
                <SelectItem value="closed">Закрытые</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все приоритеты</SelectItem>
                <SelectItem value="urgent">Срочный</SelectItem>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Тикеты поддержки ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Тема</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Приоритет</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">#{ticket.id.slice(-6)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{ticket.subject}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {ticket.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicketId(ticket.id)}
                        >
                          Открыть
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Тикет #{ticket.id.slice(-6)}: {ticket.subject}</DialogTitle>
                          <DialogDescription>
                            От {ticket.username} • {new Date(ticket.createdAt).toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedTicket && (
                          <div className="space-y-6">
                            {/* Status and Priority Controls */}
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="text-sm font-medium mb-2 block">Статус</label>
                                <Select
                                  value={selectedTicket.status}
                                  onValueChange={(value) => handleStatusChange(selectedTicket.id, value as Ticket['status'])}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Открытый</SelectItem>
                                    <SelectItem value="in-progress">В работе</SelectItem>
                                    <SelectItem value="resolved">Решенный</SelectItem>
                                    <SelectItem value="closed">Закрытый</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getStatusColor(selectedTicket.status)}>
                                  {selectedTicket.status}
                                </Badge>
                                <Badge className={getPriorityColor(selectedTicket.priority)}>
                                  {selectedTicket.priority}
                                </Badge>
                              </div>
                            </div>

                            {/* Original Message */}
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4" />
                                <span className="font-medium">{selectedTicket.username}</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(selectedTicket.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                            </div>

                            {/* Responses */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Переписка</h4>
                              {selectedTicket.responses.map((response) => (
                                <div
                                  key={response.id}
                                  className={`p-4 rounded-lg ${
                                    response.isStaff ? 'bg-primary/10 border-l-4 border-primary' : 'bg-muted'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">{response.username}</span>
                                    {response.isStaff && (
                                      <Badge variant="secondary" className="text-xs">Поддержка</Badge>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(response.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="whitespace-pre-wrap">{response.message}</p>
                                </div>
                              ))}
                            </div>

                            {/* Add Response */}
                            {selectedTicket.status !== 'closed' && (
                              <div className="space-y-3">
                                <label className="text-sm font-medium">Ответ</label>
                                <Textarea
                                  placeholder="Введите ваш ответ..."
                                  value={responseMessage}
                                  onChange={(e) => setResponseMessage(e.target.value)}
                                  className="min-h-[100px]"
                                />
                                <Button
                                  onClick={handleAddResponse}
                                  disabled={!responseMessage.trim()}
                                >
                                  Отправить ответ
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Тикеты не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTab;
