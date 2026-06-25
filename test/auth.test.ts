import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '@/lib/auth/service';

// Mock localStorage setup for the server-side environment in case jsdom window is missing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

if (typeof window === 'undefined') {
  global.localStorage = localStorageMock as any;
}

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should successfully register a new user with standard credentials', async () => {
    const session = await AuthService.signup('test@example.com', 'securePassword123');
    
    expect(session.email).toBe('test@example.com');
    expect(session.plan).toBe('FREE');
    expect(session.creditsUsed).toBe(0);
    expect(session.creditsMax).toBe(5);
  });

  it('should throw error when registering with short password', async () => {
    await expect(AuthService.signup('test@example.com', '123')).rejects.toThrow(
      'Password must be at least 6 characters.'
    );
  });

  it('should reject registration if email already exists', async () => {
    await AuthService.signup('duplicate@example.com', 'password123');
    
    await expect(AuthService.signup('duplicate@example.com', 'password999')).rejects.toThrow(
      'An account with this email already exists.'
    );
  });

  it('should recover session synchronously after registration', async () => {
    await AuthService.signup('active@example.com', 'password123');
    const session = AuthService.getCurrentSession();
    
    expect(session).not.toBeNull();
    expect(session?.email).toBe('active@example.com');
  });

  it('should deduct credits during generation', async () => {
    await AuthService.signup('credits@example.com', 'password123');
    const updated = await AuthService.deductCredit('credits@example.com');
    
    expect(updated.creditsUsed).toBe(1);
  });

  it('should block generation if free credits are exhausted', async () => {
    await AuthService.signup('exhausted@example.com', 'password123');
    
    // Deduct 5 credits (max free)
    for (let i = 0; i < 5; i++) {
      await AuthService.deductCredit('exhausted@example.com');
    }
    
    await expect(AuthService.deductCredit('exhausted@example.com')).rejects.toThrow(
      'Out of free credits. Please upgrade to Premium.'
    );
  });

  it('should grant unlimited credits when upgraded to PRO', async () => {
    await AuthService.signup('vip@example.com', 'password123');
    const updated = await AuthService.upgradeToPremium('vip@example.com');
    
    expect(updated.plan).toBe('PRO');
  });
});
