import type { AuthUser } from '../store/authStore';
import { IS_DEVELOPMENT_MOCK_MODE } from './runtimeFlags';

export interface MockLoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface MockLoginResponse {
  user: AuthUser;
  token: string;
}

// Mock test credentials
const MOCK_USERS: Record<string, Record<string, AuthUser>> = {
  intern: {
    'intern@test.com': {
      id: 1,
      name: 'John Intern',
      email: 'intern@test.com',
      role: 'intern',
      status: 'approved',
    },
  },
  company: {
    'company@test.com': {
      id: 2,
      name: 'Tech Corp',
      email: 'company@test.com',
      role: 'company',
      status: 'approved',
    },
  },
  school: {
    'school@test.com': {
      id: 3,
      name: 'University',
      email: 'school@test.com',
      role: 'school',
      status: 'approved',
    },
  },
  admin: {
    'admin@test.com': {
      id: 4,
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      status: 'approved',
    },
  },
};

const MOCK_PASSWORD = 'password'; // Universal test password

/**
 * Generate a mock JWT token
 * (Not cryptographically valid, just for development testing)
 */
function generateMockToken(userId: number, role: string): string {
  const header = window.btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = window.btoa(
    JSON.stringify({
      sub: userId,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    })
  );
  const signature = window.btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Mock login function for development
 */
// Real production accounts — always bypass mock and hit the real backend
const REAL_ACCOUNTS = ['admin@theemersonempire.info'];

export function isRealAccount(email: string): boolean {
  return REAL_ACCOUNTS.includes(email.toLowerCase());
}

export function mockLogin(request: MockLoginRequest): MockLoginResponse {
  if (!IS_DEVELOPMENT_MOCK_MODE) {
    throw new Error('Mock authentication is available only in an explicitly enabled development session.');
  }

  const { email, password, role } = request;

  // Real admin account must always use the real backend
  if (isRealAccount(email)) {
    throw new Error('USE_REAL_API');
  }

  // Validate password
  if (password !== MOCK_PASSWORD) {
    throw new Error('Invalid credentials. Use password: "password"');
  }

  // Validate role and email
  const roleUsers = MOCK_USERS[role.toLowerCase()];
  if (!roleUsers || !roleUsers[email]) {
    throw new Error(`No test user found for ${role} with email ${email}. See console for available credentials.`);
  }

  const user = roleUsers[email];
  const token = generateMockToken(user.id, user.role);

  return { user, token };
}

/**
 * Log available mock credentials to console
 */
export function logMockCredentials(): void {
  if (!IS_DEVELOPMENT_MOCK_MODE) return;

  console.group('📋 Mock Authentication Credentials (Development Only)');
  Object.entries(MOCK_USERS).forEach(([role, users]) => {
    console.group(`${role.toUpperCase()}`);
    Object.keys(users).forEach((email) => {
      console.log(`  Email: ${email}`);
    });
    console.log(`  Password: ${MOCK_PASSWORD}`);
    console.groupEnd();
  });
  console.groupEnd();
}
