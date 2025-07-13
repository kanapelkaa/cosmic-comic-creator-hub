
export interface Ticket {
  id: string;
  userId: string;
  username: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature-request' | 'bug-report' | 'other';
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
  isGuest?: boolean;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  username: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
}

class TicketStorage {
  private readonly TICKETS_KEY = 'support_tickets';
  private readonly RESPONSES_KEY = 'ticket_responses';

  getTickets(): Ticket[] {
    const tickets = localStorage.getItem(this.TICKETS_KEY);
    return tickets ? JSON.parse(tickets) : [];
  }

  getTicketById(id: string): Ticket | null {
    const tickets = this.getTickets();
    return tickets.find(ticket => ticket.id === id) || null;
  }

  getUserTickets(userId: string): Ticket[] {
    const tickets = this.getTickets();
    return tickets.filter(ticket => ticket.userId === userId);
  }

  createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'responses'>): Ticket {
    const tickets = this.getTickets();
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: []
    };
    
    tickets.push(newTicket);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
    return newTicket;
  }

  createGuestTicket(ticketData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category: Ticket['category'];
    priority: Ticket['priority'];
  }): Ticket {
    const tickets = this.getTickets();
    const newTicket: Ticket = {
      id: Date.now().toString(),
      userId: 'guest_' + Date.now(),
      username: ticketData.name,
      email: ticketData.email,
      subject: ticketData.subject,
      message: ticketData.message,
      status: 'open',
      priority: ticketData.priority,
      category: ticketData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
      isGuest: true
    };
    
    tickets.push(newTicket);
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
    return newTicket;
  }

  updateTicket(id: string, updates: Partial<Ticket>): Ticket | null {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
    
    if (ticketIndex === -1) return null;
    
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
    return tickets[ticketIndex];
  }

  addResponse(ticketId: string, responseData: Omit<TicketResponse, 'id' | 'createdAt'>): TicketResponse | null {
    const tickets = this.getTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex === -1) return null;
    
    const newResponse: TicketResponse = {
      ...responseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    tickets[ticketIndex].responses.push(newResponse);
    tickets[ticketIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(tickets));
    return newResponse;
  }

  deleteTicket(id: string): boolean {
    const tickets = this.getTickets();
    const filteredTickets = tickets.filter(ticket => ticket.id !== id);
    
    if (filteredTickets.length === tickets.length) return false;
    
    localStorage.setItem(this.TICKETS_KEY, JSON.stringify(filteredTickets));
    return true;
  }

  getTicketStats() {
    const tickets = this.getTickets();
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length,
      guest: tickets.filter(t => t.isGuest).length
    };
  }
}

export const ticketStorage = new TicketStorage();
