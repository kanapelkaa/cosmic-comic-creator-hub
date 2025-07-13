
import { useState, useEffect } from 'react';
import { ticketStorage, Ticket, TicketResponse } from '@/services/ticketStorage';
import { useAuth } from '@/hooks/useAuth';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadTickets = () => {
    setLoading(true);
    const allTickets = ticketStorage.getTickets();
    setTickets(allTickets);
    
    if (user) {
      const userSpecificTickets = ticketStorage.getUserTickets(user.id);
      setUserTickets(userSpecificTickets);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const createTicket = (ticketData: {
    subject: string;
    message: string;
    category: Ticket['category'];
    priority: Ticket['priority'];
  }) => {
    if (!user) return null;

    const newTicket = ticketStorage.createTicket({
      userId: user.id,
      username: user.username,
      email: user.email,
      status: 'open',
      ...ticketData
    });

    loadTickets();
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    const updated = ticketStorage.updateTicket(ticketId, { status });
    if (updated) {
      loadTickets();
    }
    return updated;
  };

  const addResponse = (ticketId: string, message: string) => {
    if (!user) return null;

    const response = ticketStorage.addResponse(ticketId, {
      ticketId,
      userId: user.id,
      username: user.username,
      message,
      isStaff: user.role === 'admin'
    });

    if (response) {
      loadTickets();
    }
    return response;
  };

  const getTicketById = (id: string) => {
    return ticketStorage.getTicketById(id);
  };

  const deleteTicket = (id: string) => {
    const deleted = ticketStorage.deleteTicket(id);
    if (deleted) {
      loadTickets();
    }
    return deleted;
  };

  const getTicketStats = () => {
    return ticketStorage.getTicketStats();
  };

  return {
    tickets,
    userTickets,
    loading,
    createTicket,
    updateTicketStatus,
    addResponse,
    getTicketById,
    deleteTicket,
    getTicketStats,
    refreshTickets: loadTickets
  };
};
