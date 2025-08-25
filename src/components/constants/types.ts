export interface AuthResponse {
    isSuccess: boolean;
    message?: string;
    tempToken?: string;
    token?: string;
}

export interface User {
  id: string;
  fullname: string;
  lastname: string;
  email: string;
  role: 'Admin' | 'User' | '';
}

export interface JwtPayload {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nameid: string;  // User ID
  nbf: number;
  role: 'Admin' | 'User' | '';
}

enum PlayerCategory {
  Regular = "Regular",
  VIP = "VIP",
  HighRoller = "HighRoller"
}

export interface PlayerFilter {
  pageNumber?: number;
  pageSize?: number;
  playerId?: number;
  username?: string;
  btag?: string;
  promoCode?: string;

  // New filters
  firstDepositDateFrom?: string; // ISO string
  firstDepositDateTo?: string;
  lastDepositDateFrom?: string;
  lastDepositDateTo?: string;

  firstWithdrawalDateFrom?: string;
  firstWithdrawalDateTo?: string;
  lastWithdrawalDateFrom?: string;
  lastWithdrawalDateTo?: string;

  hasWithdrawal?: boolean;
  hasDeposit?: boolean;

  registrationDateFrom?: string;
  registrationDateTo?: string;

  documentNumber?: string;
  mobileNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface Player { 
  playerId: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  city: string;
  birthday: string;
  address: string;
  gender: string;
  documentNumber: string;
  mobileNumber?: string;
  email: string;
  footballTeam?: string;
  btag?: string;
  promoCode?: string;
  balance: number;
  sportsBonusBalance: number;
  casinoBonusBalance: number;
  lastLoginDateTime?: string;
  registrationDateTime: string;
  playerCategory: PlayerCategory;
  verificationStatus: boolean;

  // 🔹 Deposit stats
  depositCount: number;
  totalDepositAmount: number;
  firstDepositDate?: string;
  firstDepositTime?: string;
  firstDepositAmount?: number;
  lastDepositDate?: string;
  lastDepositAmount?: number;

  // 🔹 Withdrawal stats
  withdrawalCount: number;
  totalWithdrawalAmount: number;
  firstWithdrawalDate?: string;
  firstWithdrawalAmount?: number;
  lastWithdrawalDate?: string;
  lastWithdrawalAmount?: number;

  firstCasinoBetDate?: string;
  lastCasinoBetDate?: string;
  firstSportBetDate?: string;
  lastSportBetDate?: string;
  totalCasinoWin?: number;
  totalSportWin?: number;
  totalCasinoStakes?: number;
  totalSportStakes?: number;
}


export interface GetAllPlayersResponse {
  isSuccess: boolean;
  message?: string;
  players: Player[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface GetPlayersDataWithIdResponse {
  isSuccess: boolean;
  message?: string;
  playerData?: Player;
}

export interface Transaction {
  transactionId: number;
  eventId: string;
  eventType: string;
  amount: number;
  type: string;
  name: string;
  status: string;
  timestamp: string;
  balanceAfter: number;
}

export interface GetPlayersTransactionHistoryResponse{
  isSuccess: boolean;
  message: string;
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface PlayerTransactionFilter{
  pageNumber?: number;
  pageSize?: number;
  playerId: string;
  eventType?: string;
  type?: string;
  timeStampFrom?: string;
  timeStampTo?: string;
}

export interface PlayerFinancialFilter{
  pageNumber?: number;
  pageSize?: number;
  playerId?: string;
  playerUsername?: string;
  playerFullName?: string;
  amountFrom?: string;
  amountTo?: string;
  typeName: string;
  status?: string;
  paymentName?: string;
  timeStampFrom?: string;
  timeStampTo?: string;
  accountNumber?: string;
  cryptoType?: string;
}

export interface FinancialTransaction {
  id: number;
  playerID: string;
  playerUsername: string;
  playerFullName: string;
  amount: number;
  type: string;
  typeName: string;
  status: string;
  paymentName: string;
  accountNumber?: string;
  bankID?: string;
  cryptoType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllFinancialTransactionsResponse{
  isSuccess: boolean;
  message: string;
  financialTransactions: FinancialTransaction[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface PaymentResponse{
  hasError: boolean;
  data: string;
  description: string;
  id: number;
}

export interface CreateBonusRequest{
  type: number;
  name: string;
  min: number;
  max: number;
  description: string;
}

export interface UpdateBonusRequest{
  defId: string;
  active: boolean;
  type: number;
  name: string;
  min: number;
  max: number;
  description: string;
}

export interface Bonus {
  type: number;
  name: string;
  defId: string;
  active: boolean;
  min:number;
  max:number;
  description: string;
  createdAt: string;
}

export interface BonusResponse {
  isSuccess: boolean;
  message?: string;
  bonuses?: Bonus[];
}

export interface ManageBonusRequest {
  direction: string;
  playerId: string;
  amount: number;
  defId: string;
}

export interface ActionResponse {
  isSuccess: boolean;
  message?: string;
}
