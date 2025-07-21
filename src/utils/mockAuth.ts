// Sistema de autenticação mock para desenvolvimento
export interface MockUser {
  id: string;
  email: string;
  nickname: string;
  avatar_url?: string;
  city?: string;
  steamId?: string;
}

const MOCK_USERS_KEY = 'mock_users';
const CURRENT_USER_KEY = 'current_user';

// Usuários pré-cadastrados para demonstração
const defaultUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@liganorte.com',
    nickname: 'AdminNorte',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminNorte',
    city: 'Manaus, AM',
    steamId: '76561198000000001'
  },
  {
    id: '2',
    email: 'player@liganorte.com',
    nickname: 'PlayerOne',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PlayerOne',
    city: 'Belém, PA',
    steamId: '76561198000000002'
  }
];

// Inicializar usuários mock se não existirem
function initializeMockUsers() {
  const existingUsers = localStorage.getItem(MOCK_USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
  }
}

// Obter todos os usuários mock
function getMockUsers(): MockUser[] {
  initializeMockUsers();
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : defaultUsers;
}

// Salvar usuários mock
function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// Obter usuário atual
export function getCurrentMockUser(): MockUser | null {
  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  return currentUser ? JSON.parse(currentUser) : null;
}

// Definir usuário atual
function setCurrentMockUser(user: MockUser | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Simular login
export async function mockLogin(email: string, password: string): Promise<{ success: boolean; user?: MockUser; error?: string }> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getMockUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, error: 'E-mail não encontrado' };
  }
  
  // Para demonstração, aceitar qualquer senha
  if (password.length < 6) {
    return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
  }
  
  setCurrentMockUser(user);
  return { success: true, user };
}

// Simular registro
export async function mockRegister(userData: {
  email: string;
  password: string;
  nickname: string;
  city?: string;
}): Promise<{ success: boolean; user?: MockUser; error?: string }> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const users = getMockUsers();
  
  // Verificar se e-mail já existe
  if (users.find(u => u.email === userData.email)) {
    return { success: false, error: 'E-mail já está em uso' };
  }
  
  // Verificar se nickname já existe
  if (users.find(u => u.nickname === userData.nickname)) {
    return { success: false, error: 'Nome de usuário já está em uso' };
  }
  
  // Criar novo usuário
  const newUser: MockUser = {
    id: Date.now().toString(),
    email: userData.email,
    nickname: userData.nickname,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.nickname}`,
    city: userData.city,
    steamId: `765611980000${Date.now().toString().slice(-5)}`
  };
  
  // Salvar novo usuário
  users.push(newUser);
  saveMockUsers(users);
  
  setCurrentMockUser(newUser);
  return { success: true, user: newUser };
}

// Simular logout
export function mockLogout() {
  setCurrentMockUser(null);
}

// Verificar se está autenticado
export function isMockAuthenticated(): boolean {
  return getCurrentMockUser() !== null;
}

// Simular login via Steam
export async function mockSteamLogin(): Promise<{ success: boolean; user?: MockUser; error?: string }> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular dados do Steam
  const steamUser: MockUser = {
    id: Date.now().toString(),
    email: `steam${Date.now()}@steam.com`,
    nickname: `SteamPlayer${Date.now().toString().slice(-4)}`,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Steam${Date.now()}`,
    steamId: `765611980000${Date.now().toString().slice(-5)}`
  };
  
  setCurrentMockUser(steamUser);
  return { success: true, user: steamUser };
}