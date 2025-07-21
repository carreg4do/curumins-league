import { supabase } from '@/integrations/supabase/client';

// Configurações do Steam OAuth
const STEAM_API_KEY = import.meta.env.VITE_STEAM_API_KEY || '';
const REDIRECT_URL = `${window.location.origin}/auth/steam/callback`;
const STEAM_LOGIN_URL = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${REDIRECT_URL}&openid.realm=${window.location.origin}&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

/**
 * Inicia o processo de login via Steam
 */
export const loginWithSteam = () => {
  window.location.href = STEAM_LOGIN_URL;
};

/**
 * Processa o retorno do login Steam e extrai o SteamID
 * @param url URL de retorno do Steam OAuth
 * @returns SteamID do usuário ou null em caso de erro
 */
export const processSteamCallback = (url: string): string | null => {
  try {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const identity = urlParams.get('openid.claimed_id');
    
    if (!identity) return null;
    
    // Extrai o SteamID do formato: https://steamcommunity.com/openid/id/76561198XXXXXXXXX
    const steamId = identity.split('/').pop();
    return steamId || null;
  } catch (error) {
    console.error('Erro ao processar callback do Steam:', error);
    return null;
  }
};

/**
 * Busca informações do perfil Steam usando a API do Steam
 * @param steamId SteamID do usuário
 * @returns Dados do perfil Steam ou null em caso de erro
 */
export const fetchSteamProfile = async (steamId: string) => {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
    );
    
    const data = await response.json();
    return data.response.players[0] || null;
  } catch (error) {
    console.error('Erro ao buscar perfil Steam:', error);
    return null;
  }
};

/**
 * Autentica o usuário no Supabase usando o SteamID
 * @param steamId SteamID do usuário
 * @param steamProfile Dados do perfil Steam
 * @returns Dados da sessão do usuário ou null em caso de erro
 */
export const authenticateWithSteam = async (steamId: string, steamProfile: any) => {
  try {
    // Verifica se o usuário já existe no Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('steam_id', steamId)
      .single();
    
    if (!existingUser) {
      // Cria um novo usuário se não existir
      await supabase.from('users').insert({
        steam_id: steamId,
        nickname: steamProfile.personaname || `Player_${steamId.substring(0, 5)}`,
        avatar_url: steamProfile.avatarfull || '',
        profile_url: steamProfile.profileurl || '',
        city: '',
        created_at: new Date().toISOString()
      });
    }
    
    // Cria uma sessão personalizada usando JWT
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${steamId}@steam.ligadonorte.com.br`,
      password: `steam_${steamId}`
    });
    
    if (error) {
      // Se o usuário não existir no auth, cria um novo
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${steamId}@steam.ligadonorte.com.br`,
        password: `steam_${steamId}`,
        options: {
          data: {
            steam_id: steamId,
            nickname: steamProfile.personaname || `Player_${steamId.substring(0, 5)}`,
            avatar_url: steamProfile.avatarfull || ''
          }
        }
      });
      
      if (signUpError) throw signUpError;
      return signUpData;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao autenticar com Steam:', error);
    return null;
  }
};

/**
 * Verifica se o usuário está autenticado e tem um SteamID válido
 * @returns Booleano indicando se o usuário está autenticado via Steam
 */
export const isSteamAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) return false;
    
    const { data: userData } = await supabase.auth.getUser();
    return !!userData.user?.user_metadata?.steam_id;
  } catch (error) {
    console.error('Erro ao verificar autenticação Steam:', error);
    return false;
  }
};