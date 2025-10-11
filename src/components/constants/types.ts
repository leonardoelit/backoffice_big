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

export enum PlayerCategory {
  Regular = 0,
  VIP = 1,
  HighRoller = 2
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
  category?: PlayerCategory;
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
  markedAsRisk: boolean,


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
  wheelSpinChance: number;
  isOnline?: boolean;
  canPlayCasino: boolean;
  canSportsBet: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
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
  note?: string;
}

export interface GetPlayersTransactionHistoryResponse{
  isSuccess: boolean;
  message: string;
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  totalAmount: number;
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
  orderBy?: string;
  orderDirection?: string;
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
  note?: string;
}

export interface GetAllFinancialTransactionsResponse{
  isSuccess: boolean;
  message: string;
  financialTransactions: FinancialTransaction[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  totalAmount: number;
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
  bonusId?: string;
  bonusBet?: string;
  bonusRounds?: string;
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
  bonusId?: string;
  bonusBet?: string;
  bonusRounds?: string;
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
  bonusId?: string;
  bonusBet?: string;
  bonusRounds?: string;
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
  isChangedFreespinRounds?: boolean;
  bonusRequestId?: number;
  note:string;
}

export interface ManagePlayerBalanceDto {
  direction: string;
  playerId: string;
  amount: number;
  note?: string;
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
  freespinWinAmount?: number;
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

export interface GameData {
  id: number;
  name: string;
  providerId: number;
  providerName: string;
}

export interface GetGameOrProviderStatsRequest{
  timeStampFrom?: string;
  timeStampTo?: string;
}

export interface GameStatsResponse {
  isSuccess: boolean;
  message?: string;
  gameStats: GameStat[]
}

export interface GameStat{
  providerId: number;
  providerName: string;
  gameName: string;
  totalBet: number;
  totalWin: number;
  profit: number;
}

export interface ProviderStatResponse {
  isSuccess: boolean;
  message?: string;
  providerStats: ProviderStat[]
}

export interface ProviderStat{
  providerId: number;
  providerName: string;
  totalBet: number;
  totalWin: number;
  profit: number;
}

export enum PrizeType {
  Freespin = 0,
  Cash = 1
}

export interface PrizeData{
  id: number;
  name: string;
  prizeType: PrizeType;
  percentage: number;
  prizeAmount: number;
  orderNumber: number;
  active: boolean;
  gameId?: string;
  gameBet?: string;
  updatedAt: string;
}

export interface WheelResponse {
  isSuccess: boolean;
  message?: string;
  prizes?: PrizeData[];
}

export interface CreateWheelPrizeRequest {
  name: string;
  prizeType: PrizeType;
  prizeAmount: number;
  percentage: number;
  gameId?: string;
  gameBet?: string;
}

export interface UpdateWheelPrizeRequest {
  id: number;
  name: string;
  prizeType: PrizeType;
  prizeAmount: number;
  percentage: number;
  active: boolean;
  gameId?: string;
  gameBet?: string;
}

export interface DeleteWheelPrizeRequest {
  prizeId: number;
}

export interface WheelArrangementData{
  id: number;
  orderNumber: number;
}

export interface WheelArrangementRequest {
  wheelArrangementList: WheelArrangementData[];
}

export interface GivePlayerWheelChanceRequest{
  playerId: string;
  spinAmount: number;
}

export enum Device {
  Mobile = 0,
  Desktop = 1
}

export interface IpLogData {
  playerId: number;
  playerUsername: string;
  ip: string;
  loginDate: string;
  device: Device;
}

export interface IpLogResponse {
  isSuccess: boolean;
  message?: string;
  ipLogs: IpLogData[];
}

export interface BlackListData {
  id: number;
  ip: string;
  employeeName: string;
  playerId?: number;
  playerUsername?: string;
  reason?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface GetBlacklistResponse {
  isSuccess: boolean;
  message?: string;
  blacklist: BlackListData[];
}

export interface BanIpRequest {
  ip: string;
  playerId?: number;
  playerUsername?: string;
  reason?: string;
  expiredAt?: string;
}

export enum NotesType{
  Financial = 0,
  Call = 1,
  Risk = 2,
  Chat = 3,
  Ban = 4
}

export interface CreatePlayerNoteRequest{
  note: string;
  playerId: number;
  notesType: NotesType;
}

export interface UpdatePlayerNoteRequest{
  id: number;
  noteType: NotesType;
  note: string;
}

export interface NoteData {
  id: number;
  writerName: string;
  type: NotesType;
  note: string;
  updatedBy?: string;
  updatedAt: string;
  createdAt: string;
}

export interface GetPlayerNotesResponse{
  isSuccess: boolean;
  message?: string;
  notes: NoteData[];
}

export interface PlayerStatsFilterByTimeDto {
  from: string; // ISO date string
  to: string;   // ISO date string
}

export interface PlayerStatsByTimeDto {
  playerId: number;
  playerUsername: string;
  playerFullName: string;
  mobileNumber: string;
  email: string;
  playerBalance: number;
  depositAmount: number;
  withdrawalAmount: number;
  lastDepositAmount: number;
  lastWithdrawalAmount: number;
  totalCasinoStakes: number;
  totalCasinoWin: number;
  totalCasinoGGR: number;
  lastDepositDate?: string;     // ISO date string
  lastWithdrawalDate?: string;  // ISO date string
  lastLoginDate?: string;       // ISO date string
}

export interface PlayerStatsFilterByTimeResponseDto {
  isSuccess: boolean;
  message?: string;
  playersStats?: PlayerStatsByTimeDto[];
}

export enum ManualFinancialEventType {
  Deposit = 0,
  Withdrawal = 1
}

export interface AddManualFinancialEventRequest {
  playerId: string;
  amount: number;
  eventType: ManualFinancialEventType,
  note?: string;
}

export interface ChangePlayersPermissionsRequest {
  playerId: number;
  canPlayCasino?: boolean;
  canSportsBet?: boolean;
  canDeposit?: boolean;
  canWithdraw?: boolean;
}

export enum MessageType{
  InApp = 0,
  Mail = 1,
  Sms = 2
}

export interface PlayerMessage{
  id: number;
  employeeName: string;
  playerId: number;
  type: MessageType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface GetPlayerMessagesResponse {
  isSuccess: boolean;
  message?: string;
  playersMessages?: PlayerMessage[];
}

export interface SendMessageRequest{
  playerId: number;
  type: MessageType;
  title: string;
  message: string;
}