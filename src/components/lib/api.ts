import { ActionResponse, AddManualFinancialEventRequest, BanIpRequest, BonusResponse, CancelOrValidateWithdrawalRequest, ChangePlayersBonusSettingRequest, ChangePlayersPermissionsRequest, CreateBonusRequest, CreatePlayerNoteRequest, CreateUserRequest, CreateWheelPrizeRequest, DashboardStatsRequestDto, DashboardStatsResponseDto, GameStatsResponse, GetAllFinancialTransactionsResponse, GetAllPlayersResponse, GetBlacklistResponse, GetBonusRequestsResponse, GetGameOrProviderStatsRequest, GetPermissionResponse, GetPlayerMessagesResponse, GetPlayerNotesResponse, GetPlayersDataWithIdResponse, GetPlayersTransactionHistoryResponse, GetRoleResponse, GetTaggedPlayersRequest, GetTaggedPlayersResponse, GetUsersResponse, GivePlayerWheelChanceRequest, IpLogResponse, LoginAsUserResponse, ManageBonusRequest, ManagePlayerBalanceDto, MarkPlayerRequest, PaymentResponse, PermissionRequest, PermissionResponse, PlayerBonusRequestFilter, PlayerBonusSettingsResponse, PlayerFilter, PlayerFinancialFilter, PlayerStatsFilterByTimeDto, PlayerStatsFilterByTimeResponseDto, PlayerTransactionFilter, ProviderStatResponse, RolePermissionRequest, RoleRequest, RoleResponse, SendMessageRequest, UpdateBonusRequest, UpdatePlayerNoteRequest, UpdatePlayersDataRequest, UpdateWheelPrizeRequest, UserResponse, UserRoleRequest, WheelArrangementRequest, WheelResponse } from "../constants/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken(): Promise<string> {
  return localStorage.getItem("authToken") || "";
}

export async function getDashboardStats(
  requestTimes: DashboardStatsRequestDto
): Promise<DashboardStatsResponseDto> {
  try {
    const token = await getToken();

    if (!requestTimes.from || !requestTimes.to) {
      return {
        isSuccess: false,
        message: "Lütfen geçerli tarih aralığı giriniz"
      }
    }

    const queryParams = new URLSearchParams({
      from: requestTimes.from,
      to: requestTimes.to
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getDashboardStats?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
    };
  }
}

export async function getPlayersStats(
  requestTimes: PlayerStatsFilterByTimeDto
): Promise<PlayerStatsFilterByTimeResponseDto> {
  try {
    const token = await getToken();

    if (!requestTimes.from || !requestTimes.to) {
      return {
        isSuccess: false,
        message: "Lütfen geçerli tarih aralığı giriniz",
      }
    }

    const queryParams = new URLSearchParams({
      from: requestTimes.from,
      to: requestTimes.to
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersStats?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch player stats',
    };
  }
}

export async function getProviderStats(
  requestTimes: GetGameOrProviderStatsRequest
): Promise<ProviderStatResponse> {
  try {
    const token = await getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getProviderTransactionStats`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestTimes),
        cache: 'no-store'
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch provider stats',
      providerStats: []
    };
  }
}

export async function getGameStats(
  requestTimes: GetGameOrProviderStatsRequest
): Promise<GameStatsResponse> {
  try {
    const token = await getToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getGameTransactionStats`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestTimes),
        cache: 'no-store'
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch game stats',
      gameStats: []
    };
  }
}

export async function getPlayers(
  filter: PlayerFilter = {}
): Promise<GetAllPlayersResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    if (filter.pageNumber) queryParams.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) queryParams.set('pageSize', filter.pageSize.toString());
    if (filter.playerId) queryParams.set('playerId', filter.playerId.toString());
    if (filter.username) queryParams.set('username', filter.username);
    if (filter.btag) queryParams.set('btag', filter.btag);
    if (filter.promoCode) queryParams.set('promoCode', filter.promoCode);

    // New filters
    if (filter.isOnline !== undefined) queryParams.set('isOnline', filter.isOnline.toString());
    if (filter.firstDepositDateFrom) queryParams.set('firstDepositDateFrom', filter.firstDepositDateFrom);
    if (filter.firstDepositDateTo) queryParams.set('firstDepositDateTo', filter.firstDepositDateTo);
    if (filter.lastDepositDateFrom) queryParams.set('lastDepositDateFrom', filter.lastDepositDateFrom);
    if (filter.lastDepositDateTo) queryParams.set('lastDepositDateTo', filter.lastDepositDateTo);

    if (filter.firstWithdrawalDateFrom) queryParams.set('firstWithdrawalDateFrom', filter.firstWithdrawalDateFrom);
    if (filter.firstWithdrawalDateTo) queryParams.set('firstWithdrawalDateTo', filter.firstWithdrawalDateTo);
    if (filter.lastWithdrawalDateFrom) queryParams.set('lastWithdrawalDateFrom', filter.lastWithdrawalDateFrom);
    if (filter.lastWithdrawalDateTo) queryParams.set('lastWithdrawalDateTo', filter.lastWithdrawalDateTo);

    if (filter.hasWithdrawal !== undefined) queryParams.set('hasWithdrawal', filter.hasWithdrawal.toString());
    if (filter.hasDeposit !== undefined) queryParams.set('hasDeposit', filter.hasDeposit.toString());

    if (filter.registrationDateFrom) queryParams.set('registrationDateFrom', filter.registrationDateFrom);
    if (filter.registrationDateTo) queryParams.set('registrationDateTo', filter.registrationDateTo);

    if (filter.documentNumber) queryParams.set('documentNumber', filter.documentNumber);
    if (filter.mobileNumber) queryParams.set('mobileNumber', filter.mobileNumber);
    if (filter.email) queryParams.set('email', filter.email);
    if (filter.firstName) queryParams.set('firstName', filter.firstName);
    if (filter.lastName) queryParams.set('lastName', filter.lastName);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getAllPlayers?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players',
      players: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
    };
  }
}

export async function getPlayerDataId(
  playerId: string
): Promise<GetPlayersDataWithIdResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    queryParams.set('playerId', playerId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayerWithId?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players'
    };
  }
}

export async function loginAsPlayer(playerId: string): Promise<LoginAsUserResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/login-as-player`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId: playerId
        }),
        cache: 'no-store'
      }
    );

    const data: LoginAsUserResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating player data:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function updatePlayersData(requestBody: UpdatePlayersDataRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/updatePlayersData`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating player data:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function changePlayersPermissions(requestBody: ChangePlayersPermissionsRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/changePlayersPermissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating player data:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getPlayerTransactions(filter: PlayerTransactionFilter): Promise<GetPlayersTransactionHistoryResponse> {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersTransactionHistory`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players transactions',
      transactions: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      totalAmount: 0
    };
  }
}

export async function getFinancialTransactions(
  filter: PlayerFinancialFilter
): Promise<GetAllFinancialTransactionsResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    if (filter.pageNumber) queryParams.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) queryParams.set('pageSize', filter.pageSize.toString());
    if (filter.playerId) queryParams.set('playerId', filter.playerId.toString());
    if (filter.playerUsername) queryParams.set('playerUsername', filter.playerUsername);


    // New filters
    if (filter.amountFrom) queryParams.set('amountFrom', filter.amountFrom);
    if (filter.amountTo) queryParams.set('amountTo', filter.amountTo);
    if (filter.timeStampFrom) queryParams.set('timeStampFrom', filter.timeStampFrom);
    if (filter.timeStampTo) queryParams.set('timeStampTo', filter.timeStampTo);

    if (filter.accountNumber) queryParams.set('accountNumber', filter.accountNumber);
    if (filter.cryptoType) queryParams.set('cryptoType', filter.cryptoType);
    if (filter.paymentName) queryParams.set('paymentName', filter.paymentName);
    if (filter.playerFullName) queryParams.set('playerFullName', filter.playerFullName);

    if (filter.status) queryParams.set('status', filter.status);
    if (filter.typeName) queryParams.set('typeName', filter.typeName);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersFinancialTransactions?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players',
      financialTransactions: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      totalAmount: 0
    };
  }
}

export async function managePendingFinancialRequest(id:number, playerId:string, type:string, res:boolean): Promise<PaymentResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const urlEnding = type === 'deposit' ? 'manageDeposit' : 'manageWithdrawal'
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/${urlEnding}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          playerId: playerId,
          result: res,
        }),
        cache: 'no-store'
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      hasError: false,
      description: error instanceof Error ? error.message : 'Failed to fetch players',
      data: "",
      id: 900,
    };
  }
}

export async function addManualFinancialEvent(requestBody: AddManualFinancialEventRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/addManualFinancialEvent`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error adding financial event:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function cancelOrValidateWithdrawal(requestBody: CancelOrValidateWithdrawalRequest): Promise<PaymentResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/cancelOrValidateWithdrawalRequest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: PaymentResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating player data:', error);
    return {
      hasError: true,
      description: "Internal server error",
      data: "",
      id: 800
    };
  }
}

export async function createBonus(requestBody: CreateBonusRequest): Promise<BonusResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/createBonus`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function updateBonus(requestBody: UpdateBonusRequest): Promise<BonusResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/updateBonus`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function deleteBonus(defId: string): Promise<BonusResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/deleteBonus`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ defId }),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getBonuses(): Promise<BonusResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getBonuses`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting bonuses:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getPlayerBonusSettings(
  playerId:string
): Promise<PlayerBonusSettingsResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    if (playerId) queryParams.set('playerId', playerId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersBonusSettings?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    const data:PlayerBonusSettingsResponse = await response.json()

    return data;
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players bonus settings',
      bonusSettingList: [],
    };
  }
}

export async function changePlayerBonusSetting(requestBody: ChangePlayersBonusSettingRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/changePlayersBonusSetting`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    // Always return the server data, even if HTTP status is not 200
    return data;

  } catch (error) {
    console.error('Error managing bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getBonusRequests(
  filter: PlayerBonusRequestFilter
): Promise<GetBonusRequestsResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    if (filter.pageNumber) queryParams.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) queryParams.set('pageSize', filter.pageSize.toString());
    if (filter.playerId) queryParams.set('playerId', filter.playerId.toString());
    if (filter.username) queryParams.set('playerUsername', filter.username);
    if (filter.bonusName) queryParams.set('bonusName', filter.bonusName);
    if (filter.defId) queryParams.set('defId', filter.defId);

    if (filter.type !== undefined) {
      queryParams.set('type', filter.type.toString());
    }

    if (filter.status !== undefined) {
      queryParams.set('status', filter.status.toString());
    }



    // New filters
    if (filter.updatedAtFrom) queryParams.set('updatedAtFrom', filter.updatedAtFrom);
    if (filter.updatedAtTo) queryParams.set('updatedAtTo', filter.updatedAtTo);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersBonusRequests?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players',
      bonusRequestList: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
    };
  }
}

export async function manageBonus(requestBody: ManageBonusRequest): Promise<BonusResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/manageBonus`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: BonusResponse = await response.json();

    // Always return the server data, even if HTTP status is not 200
    return data;

  } catch (error) {
    console.error('Error managing bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function managePlayerBalance(requestBody: ManagePlayerBalanceDto): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/managePlayerBalance`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    // Always return the server data, even if HTTP status is not 200
    return data;

  } catch (error) {
    console.error('Error managing bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function createWheelPrize(requestBody: CreateWheelPrizeRequest): Promise<WheelResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/createWheelPrize`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating wheel prize:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function updateWheelPrize(requestBody: UpdateWheelPrizeRequest): Promise<WheelResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/updateWheelPrize`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating wheel prize:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function deleteWheelPrize(prizeId: number): Promise<WheelResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/deletePrize`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prizeId }),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting prize:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getWheelPrizes(): Promise<WheelResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getWheelPrizes`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting wheel prizes:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function arrangeWheelPrizes(requestBody: WheelArrangementRequest): Promise<WheelResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/arrangeWheelPrizes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error arranging wheel prizes:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function givePlayerWheelChance(requestBody: GivePlayerWheelChanceRequest): Promise<WheelResponse>{
  try{
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/givePlayerWheelChance`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error giving player wheel chance:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

// Create a new permission
export async function createPermission(requestBody: PermissionRequest): Promise<ActionResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/create-permission`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating permission:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

// Create a new role
export async function createRole(requestBody: RoleRequest): Promise<ActionResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/create-role`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating role:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

// Assign permissions to a role
export async function assignPermissionsToRole(requestBody: RolePermissionRequest): Promise<ActionResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/assign-permissions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });
    return await res.json();
  } catch (error) {
    console.error('Error assigning permissions to role:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

// Assign roles to a user
export async function assignRolesToUser(requestBody: UserRoleRequest): Promise<ActionResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/assign-user-roles`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });
    console.log(res)
    return await res.json();
  } catch (error) {
    console.error('Error assigning roles to user:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

export async function getUsers(): Promise<GetUsersResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/get-users`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    const data:GetUsersResponse = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

// Get all roles
export async function getRoles(): Promise<GetRoleResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/get-roles`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    const data:GetRoleResponse = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

// Get all permissions
export async function getPermissions(): Promise<GetPermissionResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/get-permissions`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

// Create a new user
export async function createUser(requestBody: CreateUserRequest): Promise<ActionResponse> {
  try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/Client/roles/create-user`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      cache: 'no-store'
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating user:', error);
    return { isSuccess: false, message: 'Internal server error' };
  }
}

export async function markPlayer(requestBody: MarkPlayerRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/markPlayer`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating player data:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function removePlayerMark(tagId: number): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/removePlayersTag`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: tagId
        }),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating player data:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getTaggedPlayers(
  filter: GetTaggedPlayersRequest
): Promise<GetTaggedPlayersResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    if (filter.pageNumber) queryParams.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) queryParams.set('pageSize', filter.pageSize.toString());
    if (filter.playerId) queryParams.set('playerId', filter.playerId.toString());
    if (filter.playerUsername) queryParams.set('playerUsername', filter.playerUsername);
    if (filter.whoMarked) queryParams.set('whoMarked', filter.whoMarked);
    if (filter.type) queryParams.set('type', filter.type.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayerTags?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Failed to fetch players',
      data: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
    };
  }
}

export async function getIpLogsForPlayer(
  playerId: string
): Promise<IpLogResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    queryParams.set('playerId', playerId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getIpListForPlayer?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting ip logs:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Error getting ip logs',
      ipLogs: [],
    };
  }
}

export async function getIpLogsWithIp(
  ip: string
): Promise<IpLogResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    queryParams.set('ip', ip);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getIpListWithIp?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting ip logs:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Error getting ip logs',
      ipLogs: [],
    };
  }
}

export async function getBlackListedIps(): Promise<GetBlacklistResponse> {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getBlacklist`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting blacklisted ips:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Error getting blacklisted ips',
      blacklist: [],
    };
  }
}

export async function addIpToBlacklist(requestBody: BanIpRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/banIp`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error adding ip to blacklist:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function removeIpFromBlacklist(id: number): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/removeIpBan`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        }),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error removing ip to blacklist:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function addNote(requestBody: CreatePlayerNoteRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/player/createNote`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error adding note to player:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function updateNote(requestBody: UpdatePlayerNoteRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/player/updateNote`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getPlayerNotesWithPlayerId(
  playerId: string
): Promise<GetPlayerNotesResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    queryParams.set('playerId', playerId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/player/getNotes?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting player notes:', error);
    return {
      isSuccess: false,
      message: error instanceof Error ? error.message : 'Error getting player notes logs',
      notes: []
    };
  }
}

export async function removeNote(id: number): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/player/removeNote`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        }),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error removing player note:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function sendMessage(requestBody: SendMessageRequest): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/sendPlayerMessage`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error sending message to player:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function getPlayersMessages(playerId: number): Promise<GetPlayerMessagesResponse>{
  try{
    const token = localStorage.getItem("authToken");
    
    const queryParams = new URLSearchParams();
    queryParams.set('playerId', playerId.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersMessageWithId?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting player message:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}

export async function deletePlayerMessage(id: number): Promise<ActionResponse> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/deletePlayersMessage`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        }),
        cache: 'no-store'
      }
    );

    const data: ActionResponse = await response.json();

    return data;
  } catch (error) {
    console.error('Error deleting player message:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}