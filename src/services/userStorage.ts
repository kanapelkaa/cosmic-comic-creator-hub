
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

class UserStorage {
  private storageKey = 'users';
  
  async saveUsers(users: User[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }
  
  async loadUsers(): Promise<User[]> {
    try {
      const userData = localStorage.getItem(this.storageKey);
      const users = userData ? JSON.parse(userData) : [];
      
      // Ensure default admin user exists
      if (users.length === 0 || !users.find((user: User) => user.role === 'admin')) {
        const defaultAdmin: User = {
          id: 'admin-default',
          username: 'admin',
          email: 'admin@admin.com',
          password: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        users.push(defaultAdmin);
        await this.saveUsers(users);
      }
      
      return users;
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  }
  
  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.loadUsers();
    return users.find(user => user.email === email) || null;
  }
  
  async findUserByUsername(username: string): Promise<User | null> {
    const users = await this.loadUsers();
    return users.find(user => user.username === username) || null;
  }
  
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = await this.loadUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await this.saveUsers(users);
    return newUser;
  }
}

export const userStorage = new UserStorage();
