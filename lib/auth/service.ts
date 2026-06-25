// Abstract Authentication & State Service
// Persists users, credits, and active sessions in localStorage.
// Exposes a standard interface that can be easily connected to Supabase/Auth.js.

export interface UserSession {
  email: string;
  plan: 'FREE' | 'PRO';
  creditsUsed: number;
  creditsMax: number;
}

const STORAGE_USERS_KEY = 'vibemail_users_db';
const STORAGE_SESSION_KEY = 'vibemail_active_session';

interface UserRecord {
  email: string;
  passwordHash: string; // simulated hash
  plan: 'FREE' | 'PRO';
  creditsUsed: number;
  creditsMax: number;
}

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  private static getUsers(): Record<string, UserRecord> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(STORAGE_USERS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private static saveUsers(users: Record<string, UserRecord>) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  /**
   * Register a new user
   */
  static async signup(email: string, password: string): Promise<UserSession> {
    await delay(800); // simulate network latency
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const users = this.getUsers();
    if (users[normalizedEmail]) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: UserRecord = {
      email: normalizedEmail,
      passwordHash: btoa(password), // simple base64 hash simulation
      plan: 'FREE',
      creditsUsed: 0,
      creditsMax: 5, // 5 free credits
    };

    users[normalizedEmail] = newUser;
    this.saveUsers(users);

    const session: UserSession = {
      email: newUser.email,
      plan: newUser.plan,
      creditsUsed: newUser.creditsUsed,
      creditsMax: newUser.creditsMax,
    };

    this.saveSession(session);
    return session;
  }

  /**
   * Log in an existing user
   */
  static async login(email: string, password: string): Promise<UserSession> {
    await delay(800); // simulate network latency
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.');
    }

    const users = this.getUsers();
    const user = users[normalizedEmail];

    if (!user || user.passwordHash !== btoa(password)) {
      throw new Error('Invalid email or password.');
    }

    const session: UserSession = {
      email: user.email,
      plan: user.plan,
      creditsUsed: user.creditsUsed,
      creditsMax: user.creditsMax,
    };

    this.saveSession(session);
    return session;
  }

  /**
   * Log out current user
   */
  static async logout(): Promise<void> {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }

  /**
   * Get active session (Synchronous recovery)
   */
  static getCurrentSession(): UserSession | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as UserSession;
      
      // Sync stats with DB to ensure real-time credit updates
      const users = this.getUsers();
      const dbUser = users[parsed.email];
      if (dbUser) {
        return {
          email: dbUser.email,
          plan: dbUser.plan,
          creditsUsed: dbUser.creditsUsed,
          creditsMax: dbUser.creditsMax,
        };
      }
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Deduct 1 credit for generation.
   * Throws if out of credits and not Premium.
   */
  static async deductCredit(email: string): Promise<UserSession> {
    const normalizedEmail = email.toLowerCase().trim();
    const users = this.getUsers();
    const user = users[normalizedEmail];

    if (!user) {
      throw new Error('User not found.');
    }

    if (user.plan === 'FREE' && user.creditsUsed >= user.creditsMax) {
      throw new Error('Out of free credits. Please upgrade to Premium.');
    }

    user.creditsUsed += 1;
    users[normalizedEmail] = user;
    this.saveUsers(users);

    const updatedSession: UserSession = {
      email: user.email,
      plan: user.plan,
      creditsUsed: user.creditsUsed,
      creditsMax: user.creditsMax,
    };
    this.saveSession(updatedSession);
    return updatedSession;
  }

  /**
   * Upgrade user to Premium plan
   */
  static async upgradeToPremium(email: string): Promise<UserSession> {
    await delay(1200); // simulate payment checkout delay
    const normalizedEmail = email.toLowerCase().trim();
    const users = this.getUsers();
    const user = users[normalizedEmail];

    if (!user) {
      throw new Error('User not found.');
    }

    user.plan = 'PRO';
    users[normalizedEmail] = user;
    this.saveUsers(users);

    const updatedSession: UserSession = {
      email: user.email,
      plan: 'PRO',
      creditsUsed: user.creditsUsed,
      creditsMax: user.creditsMax,
    };
    this.saveSession(updatedSession);
    return updatedSession;
  }

  private static saveSession(session: UserSession) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  }
}
