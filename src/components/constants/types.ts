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
  role: string[]; // <-- multiple roles
  permissions?: string[]; // optional, if you want to store permission claims too
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
  role: string[];
}

export interface JwtPayload {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  unique_name: string;
  clientId: string;
  clientName: string;
  sub: string;  // User ID
  nbf: number;
  role: string[];  // <-- multiple roles
  Permission?: string[]; // optional permissions array
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
  isOnline?: boolean;
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
  isOnline?: boolean;
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
  playerId?: string;
  playerUsername?: string;
  eventTypes?: string[];
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
  isPercentage: boolean;
  percentage?: number;
  min: number;
  max: number;
  description: string;
}

export interface UpdateBonusRequest{
  defId: string;
  active: boolean;
  type: number;
  name: string;
  isPercentage: boolean;
  percentage?: number;
  min: number;
  max: number;
  description: string;
}

export interface Bonus {
  type: number;
  name: string;
  defId: string;
  active: boolean;
  isPercentage: boolean;
  percentage?: number;
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

export interface PlayerBonusSettingsResponse{
  isSuccess: boolean;
  message?: string;
  bonusSettingList: BonusSettingData[];
}

export interface BonusSettingData{
bonusId: number;
  name: string;
  type: number;
  percentage?: number;
  defaultPercentage?: number;
  isPercentage: boolean;
  note: string | null;
  defId: string;
}

export interface ChangePlayersBonusSettingRequest{
  playerId: number;
  bonusId: number;
  percentage: number;
}

export interface ManageBonusRequest {
  result: boolean;
  direction: string;
  playerId: string;
  amount: number;
  defId?: string;
  bonusRequestId?: number;
  note:string;
}

export interface ManagePlayerBalanceDto {
  direction: string;
  playerId: string;
  amount: number;
}

export interface ActionResponse {
  isSuccess: boolean;
  message?: string;
}

export interface UpdatePlayersDataRequest {
  playerId: string;

  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  birthday?: string;         
  address?: string;
  gender?: number;           
  documentNumber?: string;
  mobileNumber?: string;
  email?: string;
  password?: string;
  btag?: string;
  promoCode?: string;

  emailSubscription?: boolean;
  smsSubscription?: boolean;
}

export interface RolePermissionRequest {
  roleName: string;
  permissions: string[]; // array of permission names
}

export interface UserRoleRequest {
  userId: string; // AppUser Id
  roles: string[];
}

export interface RoleRequest {
  roleName: string;
}

export interface PermissionRequest {
  name: string;
}

export interface RolePermissionRequest {
  roleName: string;
  permissions: string[];
}

export interface UserRoleRequest {
  userId: string;
  roles: string[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface GetUsersResponse {
  isSuccess: boolean;
  message?: string;
  data?: UserResponse[];
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
  roles: string[];
}

export interface GetRoleResponse {
  isSuccess: boolean;
  message?: string;
  data?: RoleResponse[];
}

export interface RoleResponse {
  id: string;
  name: string;
}

export interface GetPermissionResponse {
  isSuccess: boolean;
  message?: string;
  data?: PermissionResponse[];
}

export interface PermissionResponse {
  id: string;
  name: string;
}

export interface PlayerBonusRequestFilter {
  pageNumber?: number;
  pageSize?: number;
  playerId?: string;
  username?: string;
  bonusName?: string;
  type?: number;
  defId?: string;
  status?: number;

  updatedAtFrom?: string;
  updatedAtTo?: string;
}

export interface GetBonusRequestsResponse{
  isSuccess: boolean;
  message?: string;
  bonusRequestList: BonusData[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface BonusData {
  id: number;
  playerId: string;
  playerName: string;
  clientName?: string;
  bonusName: string;
  percentage?: number;
  lastDepositAmount: number;
  lastDepositTime?: string;
  lastWithdrawalTime?: string;
  defId: string;
  type: number;
  lastTimePlayerTakeBonus?: string;
  status: number;
  note?: string;
  updatedAt: string;
}

export interface NotificationCounts {
  withdrawRequest: number;
  depositRequest: number;
  bonusRequest: number;
}

export interface DashboardStatsResponseDto {
  isSuccess: boolean;
  message?: string;
  stats?: DashboardStatsDto;
}

export interface DashboardStatsRequestDto {
  from: string; //timestamp
  to: string; // timestamp
}

export interface DashboardStatsDto {
  totalDepositAmount: number;
  totalDepositCount: number;
  totalWithdrawalAmount: number;
  totalWithdrawalCount: number;
  netProfit: number;
  totalBonus: number;
  ggr: number;
  totalCasinoBet: number;
  totalCasinoWin: number;
  totalPlayerCount: number;
  playersWithMostWithdrawal?: DashboardPlayerData[];
  playersWithMostDeposit?: DashboardPlayerData[];
}

export interface DashboardPlayerData {
  playerId: number;
  playerName: string;
  amount: number;
  count: number;
}

export interface MarkPlayerRequest {
  playerId: string;
  type: RiskOrFavorite;
  note?: string;
}

export enum RiskOrFavorite {
  Risk = 0,
  Favorite = 1
}

export interface GetTaggedPlayersRequest {
  pageNumber?: number;
  pageSize?: number;
  type: RiskOrFavorite;
  playerId?: string;
  playerUsername?: string;
  whoMarked?: string;
}

export interface GetTaggedPlayersResponse {
  isSuccess: boolean;
  message?: string;
  data?: TaggedPlayer[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export interface TaggedPlayer {
  id: number;
  whoMarked?: string;
  playerId: number;
  playerFullName: string;
  playerUsername: string;
  totalDepositAmount: number;
  totalWithdrawalAmount: number;
  lastDepositAmount?: number;
  lastDepositDate?: string;
  lastWithdrawalAmount?: number;
  lastWithdrawalDate?: string;
  note?: string;
  createdAt: string;
}

export interface CancelOrValidateWithdrawalRequest{
  playerId: string;
  id: number;
  result: boolean;
}

export interface LoginAsUserResponse {
    isSuccess: boolean;
    message?: string;
    url?: string;
    token?: string;
}