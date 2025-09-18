'use client';

import { parseJwt } from '@/utils/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from 'react';

import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { AuthResponse, GameData, JwtPayload, Player, User } from '@/components/constants/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  clientId: string | null;
  clientName: string | null;
  isLoadingSignIn: boolean;
  userInfo: User;
  allPlayerData: Player[];
  games: GameData[];
  playerBalanceData: PlayerBalanceResponse;
  login: (response: AuthResponse) => void;
  logout: () => void;
  logoutAdmin: (response: LoginResponse) => void;
}

export interface UserInfo {
    username: string;
    fullName: string;
    lastName: string;
    role: string;
    btag: string;
    telegramLink: string;
    balance: number;
    TMTDeposit: number,
    TMTWithdrawal: number,
    userCount: number,
    pct: number;
    approved: boolean;
}

interface LoginResponse {
    isSuccess: boolean,
    token: string,
    fullname: string,
    lastname: string,
    username: string,
    role:string;
    pct: number,
    telegramLink: string;
    balance: number;
    TMTDeposit: number,
    TMTWithdrawal: number,
    userCount: number,
    approved: boolean;
}

export interface PlayerBalanceResponse {
  playerCount: number,
  balanceList: PlayerBalanceList[]
}

export interface PlayerBalanceList {
  playerId: number,
  playerName: string,
  playerBalance: number,
}

export interface Transaction {
  id: number;
  type: string;
  username: string;
  balanceBefore: number;
  amount: number;
  balanceAfter: number;
  category: string;
  adminName: string;
  createdAt: string;
  updatedAt: string; 
}

export interface Withdrawal {
  id: number;
  category: string;
  username: string;
  amount: number;
  accNum: string;
  adminName?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string; 
}

export interface EnrichedClientData {
  ClientId: number;
  Login: string;
  Name: string;
  BTag: string;
  DepositAmount: number;
  DepositCount: number;
  WithdrawalAmount: number;
  WithdrawalCount: number;
  dateLocal: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingSignIn, setIsLoadingSignIn] = useState(false);

  const [userInfo, setUserInfo] = useState<User>({
    id: '',
    email: '',
    fullname: '',
    lastname: '',
    role: ["User"],
  });
  const [allPlayerData, setAllPlayerData] = useState<Player[]>([]);
  const [playerBalanceData, setPlayerBalanceData] = useState<PlayerBalanceResponse>({
    playerCount: 0,
    balanceList: [],
  });

  const router = useRouter();

  // Initial Token Fetch
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) return;

    fetch('/data/games.json')
    .then(res => res.json())
    .then((data: GameData[]) => setGames(data))
    .catch(err => console.error('Failed to load games.json', err));

    const userDetail:JwtPayload = parseJwt(storedToken) 

    // Fetch User Info
    startTransition(async () => {
      const nameParts = userDetail.unique_name.trim().split(/\s+/);
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';
      if (userDetail) {
        setClientId(userDetail.clientId)
        setClientName(userDetail.clientName)
        setUserInfo({
          id: userDetail.sub,
          fullname: firstname,
          lastname: lastname,
          email: userDetail.email,
          role: userDetail.role
        })
        //if (userDetail.role === 'User') getAllAffiliates(storedToken);
        setIsAuthenticated(true);
        setToken(storedToken);
        //setIsAdmin(userDetail.role.includes("SuperAdmin"));
      }else{
        logout()
        router.push('/signin')
      }
    });
  }, []);

const login = useCallback((response: AuthResponse) => {
  if (!response.isSuccess) {
    console.warn('Invalid credentials — login blocked.');
    setIsAuthenticated(false);
    return;
  }

  const userDetail: JwtPayload = parseJwt(response.token!);
  if (!userDetail) {
    logout();
    return;
  }

  fetch('/data/games.json')
    .then(res => res.json())
    .then((data: GameData[]) => setGames(data))
    .catch(err => console.error('Failed to load games.json', err));

  const nameParts = userDetail.unique_name.trim().split(/\s+/);
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  setClientId(userDetail.clientId)
  setClientName(userDetail.clientName)

  setUserInfo({
    id: userDetail.sub,
    fullname: firstname,
    lastname: lastname,
    email: userDetail.email,
    role: userDetail.role,
  });

  setIsLoadingSignIn(false);
  localStorage.setItem('authToken', response.token!);

  setToken(response.token!);
  setIsAuthenticated(true);
  //setIsAdmin(userDetail.role.includes("SuperAdmin"));
}, []);


  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    deleteCookie('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setIsAdmin(false);

    setUserInfo({
      id: '',
      fullname: '',
      lastname: '',
      role: '',
      email: ''
    });

    setPlayerBalanceData({ playerCount: 0, balanceList: [] });
    setAllAffiliateList([]);
    setAffiliatesListInSelectedTime([]);
    setAllPlayerData([]);
  }, []);

  const logoutAdmin = useCallback((response: LoginResponse) => {
    startTransition(() => {
      localStorage.removeItem('authToken');
      setIsAdmin(false);
  
      setPlayerBalanceData({ playerCount: 0, balanceList: [] });
      setAllAffiliateList([]);
      setAffiliatesListInSelectedTime([]);
      setAllPlayerData([]);
  
      setIsLoadingSignIn(true);
      localStorage.setItem('authToken', response.token);
      
  
      setToken(response.token);
      setIsAuthenticated(true);
      setIsAdmin(response.role === 'admin');
  
      const parsed = parseJwt(response.token);

      console.log(parsed)
      setUserInfo({
        username: response.username,
        fullName: response.fullname,
        lastName: response.lastname,
        role: parsed.role,
        btag: parsed.bTag,
        telegramLink: response.telegramLink,
        balance: response.balance,
        TMTDeposit: response.TMTDeposit,
        TMTWithdrawal: response.TMTWithdrawal,
        userCount: response.userCount,
        pct: response.pct,
        approved: response.approved
      });
  
      if (response.role === 'user') getAllAffiliates(response.token);
    })
  }, []);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    isAdmin,
    token,
    isLoadingSignIn,
    userInfo,
    allPlayerData,
    playerBalanceData,
    clientId,
    clientName,
    games,
    login,
    logout,
    logoutAdmin
  }), [
    isAuthenticated, isAdmin, token, clientId, clientName, games, isLoadingSignIn,
    userInfo,
    allPlayerData, playerBalanceData,
    login, logout, logoutAdmin
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};