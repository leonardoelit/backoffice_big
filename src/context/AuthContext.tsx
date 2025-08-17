'use client';

import {
  getAllTransactions,
  getAllUserAffiliates,
  getAllUsers,
  getAllWithdrawalRequests,
  getUserAffiliatesWithTime,
  getUserInfo,
  getUsersTransactions,
  getUserWithdrawals,
  changeUserCredentials,
  getAllAffiliatesWithTimeAdmin,
} from '@/server/userActions';

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
import { showToast } from '@/utils/toastUtil';
import { AuthResponse, JwtPayload, User } from '@/components/constants/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  isLoadingSignIn: boolean;
  userInfo: User;
  allAffiliatesList: ClientKpi[];
  allPlayerData: Player[];
  affiliatesListInSelectedTime: EnrichedClientData[];
  allAffiliatesListInSelectedTime: EnrichedClientData[];
  playerBalanceData: PlayerBalanceResponse;
  usersTransactions: Transaction[];
  getUserTransactions: () => void;
  usersWithdrawals: Withdrawal[];
  getUsersWithdrawals: () => void;
  allUsersList: User[];
  getAllUsersAdmin: () => void;
  allTransactionsList: Transaction[];
  getAllTransactionsAdmin: () => void;
  allWithdrawalRequests: Withdrawal[];
  getAllWithdrawalsAdmin: () => void;
  changeUserCredentialsAdmin: (username:string, btag:string|null, pct:number|null, password:string|null, approve: boolean | null) => void;
  login: (response: LoginResponse) => void;
  logout: () => void;
  logoutAdmin: (response: LoginResponse) => void;
  getAffiliatesWithTime: (range: {
    MinCreatedLocal: string,
    MaxCreatedLocal: string,
  }) => void;
  getAllAffiliatesWithTime: (range: {
    MinCreatedLocal: string,
    MaxCreatedLocal: string,
  }) => void;
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

export interface ClientKpi {
  BTag: string;
  CasinoProfitness: number;
  ClientId: number;
  CurrencyId: string;
  DepositAmount: number;
  DepositCount: number;
  FirstDepositTime: string | null;
  FirstDepositTimeLocal: string | null;
  GamingProfitAndLose: number;
  Id: number;
  IsTest: boolean;
  IsVerified: boolean;
  LastCasinoBetTime: string | null;
  LastCasinoBetTimeLocal: string | null;
  LastDepositAmount: number;
  LastDepositTime: string | null;
  LastDepositTimeLocal: string | null;
  LastSportBetTime: string | null;
  LastSportBetTimeLocal: string | null;
  LastWithdrawalAmount: number;
  LastWithdrawalTime: string | null;
  LastWithdrawalTimeLocal: string | null;
  Login: string;
  Name: string;
  ProfitAndLose: number | null;
  SportProfitness: number;
  SportsbookProfileId: number;
  TotalCasinoBonusStakes: number;
  TotalCasinoBonusWinings: number;
  TotalCasinoStakes: number;
  TotalCasinoWinnings: number;
  TotalDeposit: number;
  TotalSportBets: number;
  TotalSportBonusStakes: number;
  TotalSportBonusWinings: number;
  TotalSportStakes: number;
  TotalSportWinnings: number;
  TotalUnsettledBets: number;
  TotalUnsettledStakes: number;
  TotalWithdrawal: number;
  WithdrawalAmount: number;
  WithdrawalCount: number;
}

export interface Player {
  Id: number;
  CurrencyId: string;
  Currencies: any;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Login: string;
  RegionId: number;
  Gender: number;
  PersonalId: string;
  Address: string;
  Email: string;
  Language: string;
  Phone: string;
  MobilePhone: string;
  BirthDate: string;
  TimeZone: any;
  NickName: string | null;
  DocNumber: string;
  IBAN: string | null;
  PromoCode: string | null;
  ProfileId: number | null;
  MaximalDailyBet: number | null;
  MaximalSingleBet: number | null;
  CasinoMaximalDailyBet: number | null;
  CasinoMaximalSingleBet: number | null;
  PreMatchSelectionLimit: number | null;
  LiveSelectionLimit: number | null;
  Excluded: boolean | null;
  ExcludedLocalDate: string | null;
  IsSubscribedToNewsletter: boolean;
  IsVerified: boolean;
  PartnerName: string;
  PartnerId: number;
  LastLoginIp: string;
  RegistrationIp: string;
  YesterdayBalance: number | null;
  CreditLimit: number;
  IsUsingCredit: boolean;
  LastLoginTime: string;
  LastLoginLocalDate: string;
  Balance: number;
  IsLocked: boolean;
  IsCasinoBlocked: boolean | null;
  IsSportBlocked: boolean | null;
  IsRMTBlocked: boolean | null;
  Password: string | null;
  SportsbookProfileId: number;
  CasinoProfileId: number | null;
  GlobalLiveDelay: number | null;
  Created: string;
  CreatedLocalDate: string;
  RFId: string | null;
  ResetExpireDate: string | null;
  ResetExpireDateLocal: string | null;
  DocIssuedBy: string | null;
  LoyaltyLevelId: number | null;
  IsUsingLoyaltyProgram: boolean;
  LoyaltyPoint: number;
  AffilateId: number | null;
  BTag: string;
  TermsAndConditionsVersion: string;
  TCVersionAcceptanceDate: string;
  TCVersionAcceptanceLocalDate: string;
  ExcludedLast: string | null;
  ExcludedLastLocal: string | null;
  UnplayedBalance: number;
  IsTest: boolean;
  ExternalId: string | null;
  AuthomaticWithdrawalAmount: number | null;
  AuthomaticWithdrawalMinLeftAmount: number | null;
  IsAutomaticWithdrawalEnabled: boolean | null;
  SwiftCode: string | null;
  Title: string | null;
  BirthCity: string | null;
  BirthDepartment: string | null;
  BirthRegionId: number | null;
  ZipCode: string | null;
  BirthRegionCode2: string | null;
  ActivationCode: string | null;
  ActivationCodeExpireDate: string | null;
  ActivationCodeExpireDateLocal: string | null;
  LastSportBetTime: string | null;
  LastSportBetTimeLocal: string | null;
  LastCasinoBetTime: string;
  LastCasinoBetTimeLocal: string;
  FirstDepositTime: string | null;
  FirstDepositDateLocal: string | null;
  LastDepositDateLocal: string | null;
  LastDepositTime: string | null;
  PasswordChangedLastLocal: string | null;
  PasswordChangedLast: string | null;
  ActivationState: number | null;
  ExcludeTypeId: number | null;
  DocIssueDate: string | null;
  DocIssueCode: string | null;
  Province: string | null;
  IsResident: boolean;
  RegistrationSource: number;
  IncomeSource: string | null;
  AccountHolder: string | null;
  CashDeskId: number | null;
  ClientCashDeskName: string | null;
  IsSubscribeToEmail: boolean;
  IsSubscribeToSMS: boolean;
  IsSubscribeToInternalMessage: boolean;
  IsSubscribeToPushNotification: boolean;
  IsSubscribeToPhoneCall: boolean;
  NotificationOptions: number;
  IsLoggedIn: boolean;
  City: string | null;
  CountryName: string;
  ClientVerificationDate: string | null;
  BankName: string | null;
  Status: number;
  IsNoBonus: boolean;
  IsTwoFactorAuthenticationEnabled: boolean | null;
  IsQRCodeUsed: boolean | null;
  PartnerClientCategoryId: number | null;
  WrongLoginBlockLocalTime: string | null;
  WrongLoginAttempts: number;
  LastWrongLoginTimeLocalDate: string | null;
  PepStatusId: number | null;
  SelectedPepStatuses: any;
  DocRegionId: number | null;
  DocRegionName: string | null;
  DocType: number | null;
  DocExpirationDate: string | null;
  AMLRisk: number | null;
  ExclusionReason: string | null;
  Citizenship: string | null;
  IsPhoneVerified: boolean;
  IsMobilePhoneVerified: boolean;
  IsEkengVerified: boolean;
  IsEmailVerified: boolean;
  OwnerId: number | null;
  ChildId: number | null;
  BirthName: string | null;
  StatusActiveDate: string | null;
  StatusActiveDateLocalTime: string | null;
  PartnerFlag: string | null;
  AdditionalAddress: string | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingSignIn, setIsLoadingSignIn] = useState(false);

  const [userInfo, setUserInfo] = useState<User>({
    id: '',
    email: '',
    fullname: '',
    lastname: '',
    role: "User",
  });

  const [allAffiliatesList, setAllAffiliateList] = useState<ClientKpi[]>([]);
  const [affiliatesListInSelectedTime, setAffiliatesListInSelectedTime] = useState<EnrichedClientData[]>([]);
  const [allAffiliatesListInSelectedTime, setAllAffiliatesListInSelectedTime] = useState<EnrichedClientData[]>([]);
  const [allPlayerData, setAllPlayerData] = useState<Player[]>([]);
  const [playerBalanceData, setPlayerBalanceData] = useState<PlayerBalanceResponse>({
    playerCount: 0,
    balanceList: [],
  });

  const [usersTransactions, setUsersTransactions] = useState<Transaction[]>([]);
  const [usersWithdrawals, setUsersWithdrawals] = useState<Withdrawal[]>([]);
  const [allUsersList, setAllUsersList] = useState<User[]>([]);
  const [allTransactionsList, setAllTransactionsList] = useState<Transaction[]>([]);
  const [allWithdrawalRequests, setAllWithdrawalRequests] = useState<Withdrawal[]>([]);

  const router = useRouter();

  // Initial Token Fetch
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) return;

    const userDetail:JwtPayload = parseJwt(storedToken) 

    // Fetch User Info
    startTransition(async () => {
      const nameParts = userDetail.name.trim().split(/\s+/);
      const firstname = nameParts[0] || '';
      const lastname = nameParts.slice(1).join(' ') || '';
      console.log(firstname, " ", lastname)
      if (userDetail) {
        setUserInfo({
          id: userDetail.nameid,
          fullname: firstname,
          lastname: lastname,
          email: userDetail.email,
          role: userDetail.role
        })
        //if (userDetail.role === 'User') getAllAffiliates(storedToken);
        setIsAuthenticated(true);
        setToken(storedToken);
        setIsAdmin(userDetail.role === 'Admin');
      }else{
        logout()
        router.push('/signin')
      }
    });
  }, []);

  

  const getAllAffiliates = useCallback((token: string) => {
    startTransition(async () => {
      const res = await getAllUserAffiliates(token);
      if (res.isSuccess) {
        setAllAffiliateList(res.data.allTimeData.reverse());
        setAllPlayerData(res.data.allPlayerData.reverse());
      }
      setIsLoadingSignIn(false);
    });
  }, []);

  const getAffiliatesWithTime = useCallback((range: {
    MinCreatedLocal: string;
    MaxCreatedLocal: string;
  }) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    startTransition(async () => {
      const res = await getUserAffiliatesWithTime(authToken, range);
      if (res.isSuccess) {
        setAffiliatesListInSelectedTime(res.affiliateList);
        setPlayerBalanceData({
          playerCount: res.balanceData.playerCount,
          balanceList: res.balanceData.balanceList.reverse(),
        });
      }
    });
  }, []);

  const getUserTransactions = useCallback(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    startTransition(async () => {
      const res = await getUsersTransactions(authToken);
      if (res.isSuccess) setUsersTransactions(res.transactionData);
    });
  }, []);

  const getUsersWithdrawals = useCallback(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    startTransition(async () => {
      const res = await getUserWithdrawals(authToken);
      if (res.isSuccess) setUsersWithdrawals(res.withdrawalHistory);
    });
  }, []);

  const getAllUsersAdmin = useCallback(() => {
    if (!token) return;

    startTransition(async () => {
      const res = await getAllUsers(token);
      console.log(res)
      if (res.isSuccess) setAllUsersList(res.allUsers);
    });
  }, [token]);

  const getAllAffiliatesWithTime = useCallback((range: {
    MinCreatedLocal: string;
    MaxCreatedLocal: string;
  }) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    startTransition(async () => {
      const res = await getAllAffiliatesWithTimeAdmin(authToken, range);
      if (res.isSuccess) {
        setAllAffiliatesListInSelectedTime(res.allUsersDataWithTime);
      }else{
        showToast('Belirli zaman aralığındaki user data larını alırken hata', 'error')
      }
    });
  }, []);

  const getAllTransactionsAdmin = useCallback(() => {
    if (!token || parseJwt(token).role !== 'admin') return;

    startTransition(async () => {
      const res = await getAllTransactions(token);
      if (res.isSuccess) setAllTransactionsList(res.allTransactions);
    });
  }, [token]);

  const getAllWithdrawalsAdmin = useCallback(() => {
    if (!token || parseJwt(token).role !== 'admin') return;

    startTransition(async () => {
      const res = await getAllWithdrawalRequests(token);
      if (res.isSuccess) setAllWithdrawalRequests(res.allWithdrawalRequests);
    });
  }, [token]);

  const changeUserCredentialsAdmin = useCallback(
    async (username: string, btag: string | null, pct: number | null, password: string | null, approve: boolean | null) => {
      if (!token || parseJwt(token).role !== 'admin') return;

      const res = await changeUserCredentials(token, username, btag, pct, password, approve);
      if (!res.isSuccess) console.warn(res.message);
    },
    [token]
  );

const login = useCallback((response: AuthResponse) => {
  if (!response.isSuccess) {
    console.warn('Invalid credentials — login blocked.');
    setIsAuthenticated(false);
    return;
  }

  const userDetail:JwtPayload = parseJwt(response.token!)

  if(userDetail === null){
    logout();
    return;
  }

  const nameParts = userDetail.name.trim().split(/\s+/);
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';

  setUserInfo({
    id: userDetail.nameid,
    fullname: firstname,
    lastname: lastname,
    email: userDetail.email,
    role: userDetail.role
  })

  setIsLoadingSignIn(true);
  localStorage.setItem('authToken', response.token!);

  setToken(response.token!);
  setIsAuthenticated(true);
  setIsAdmin(userDetail.role === 'Admin');
  //setIsAdmin(response.role === 'admin');

  //const parsed = parseJwt(response.token);


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
    allAffiliatesList,
    allPlayerData,
    affiliatesListInSelectedTime,
    allAffiliatesListInSelectedTime,
    getAllAffiliatesWithTime,
    playerBalanceData,
    getAffiliatesWithTime,
    usersTransactions,
    getUserTransactions,
    usersWithdrawals,
    getUsersWithdrawals,
    allUsersList,
    getAllUsersAdmin,
    allTransactionsList,
    getAllTransactionsAdmin,
    allWithdrawalRequests,
    getAllWithdrawalsAdmin,
    changeUserCredentialsAdmin,
    login,
    logout,
    logoutAdmin
  }), [
    isAuthenticated, isAdmin, token, isLoadingSignIn,
    userInfo, allAffiliatesList,
    allPlayerData, affiliatesListInSelectedTime, allAffiliatesListInSelectedTime, playerBalanceData,
    usersTransactions, usersWithdrawals, allUsersList,
    allTransactionsList, allWithdrawalRequests,
    getAffiliatesWithTime, getAllAffiliatesWithTime, getUserTransactions, getUsersWithdrawals,
    getAllUsersAdmin, getAllTransactionsAdmin, getAllWithdrawalsAdmin,
    changeUserCredentialsAdmin, login, logout, logoutAdmin
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