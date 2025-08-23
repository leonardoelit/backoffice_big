import { BonusResponse, CreateBonusRequest, GetAllFinancialTransactionsResponse, GetAllPlayersResponse, GetPlayersDataWithIdResponse, GetPlayersTransactionHistoryResponse, ManageBonusRequest, PaymentResponse, PlayerFilter, PlayerFinancialFilter, PlayerTransactionFilter, UpdateBonusRequest } from "../constants/types";


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
    if (filter.promoCode) queryParams.set('promoCode', filter.promoCode);

    // New filters
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

export async function getPlayerTransactions(
  filter: PlayerTransactionFilter
): Promise<GetPlayersTransactionHistoryResponse> {
  try {
    const token = localStorage.getItem("authToken");
    
    // Convert filter to query params
    const queryParams = new URLSearchParams();
    
    if (filter.pageNumber) queryParams.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) queryParams.set('pageSize', filter.pageSize.toString());
    if (filter.playerId) queryParams.set('playerId', filter.playerId.toString());
    if (filter.eventType) queryParams.set('eventType', filter.eventType);
    if (filter.type) queryParams.set('type', filter.type);
    if (filter.timeStampFrom) queryParams.set('timeStampFrom', filter.timeStampFrom);
    if (filter.timeStampTo) queryParams.set('timeStampTo', filter.timeStampTo);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Client/getPlayersTransactionHistory?${queryParams.toString()}`,
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
      message: error instanceof Error ? error.message : 'Failed to fetch players transactions',
      transactions: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
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
      totalCount: 0
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
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
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

    console.log(response)
    
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

export async function manageBonus(requestBody: ManageBonusRequest): Promise<BonusResponse>{
  try{
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
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error managing bonus:', error);
    return {
      isSuccess: false,
      message: "Internal server error"
    };
  }
}