"use server"

import { redirect } from "next/navigation";

export async function authenticateUser(email: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/client/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getUserInfo(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getUserInfo`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function registerAction(username:string, fullName:string, lastname:string, email:string, btag:string, telegramLink:string, password:string) {

  const userData = {
    username: username,
    fullname: fullName,
    lastname: lastname,
    email: email,
    btag: btag,
    telegramLink: telegramLink,
    password: password
  };

  let result;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }
    );

    result = await res.json();

    if (!result.isSuccess) {
      if (result.userExistErrorObject) {
        return { isSuccess: false , userExistErrorObject: result.userExistErrorObject };
      }else{
        return result;
      }
    }
  } catch (error) {
    console.log('Error registering user: ', error);
  }

  if (result.isSuccess) {
    redirect('/signin');
  }
}

export async function getAllUserAffiliates(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getAllUserAffiliates`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getUserAffiliatesWithTime(token: string, range:{
    MinCreatedLocal: string,
    MaxCreatedLocal: string,
}) {
  try {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getUserAffiliatesWithTime`,
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
        },
        body: JSON.stringify({
        minCreatedLocal: range.MinCreatedLocal,
        maxCreatedLocal: range.MaxCreatedLocal,
        }),
    });

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getUsersTransactions(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/transactions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function createWithdrawalRequest(token: string, username:string, category:string, amount:number, accNumber:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/createWithdrawalRequest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username, amount: amount, category: category, accNum: accNumber }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getUserWithdrawals(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/withdrawalRequests`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getAllUsers(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getAllUsers`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getUserInfoAdmin(token: string, username:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getUserInfoAdmin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getAllTransactions(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getAllTransactions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getAllWithdrawalRequests(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getAllWithdrawalRequests`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function createNewUser(token: string, username:string, fullname:string, lastname:string, email:string, btag:string, telegramLink:string, password:string, role:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/admin/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username, fullname: fullname, lastname: lastname, email: email, btag: btag, telegramLink: telegramLink, password: password, role:role }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function changeWithdrawalStatusById(token: string, withdrawalId:number, status:string, adminName:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/changeWithdrawalStatusById`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ withdrawalId: withdrawalId, status: status, adminName: adminName }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function createTransaction(token: string, type:string, username:string, amount:number, category:string, adminName:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/createTransaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ type: type, username: username, amount: amount, category: category, adminName: adminName }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function changeUserCredentials(token: string, username:string, btag:string|null, pct:number|null, password:string|null, approve:boolean|null  ) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/changeUserInfo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username, btag: btag, pct: pct, password: password, approve: approve }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function deleteUser(token: string, username:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/deleteUser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function loginAsUser(token: string, username:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/loginAsUser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getAllAffiliates(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getAllUserAffiliatesAdmin`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    
    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getAllAffiliatesWithTimeAdmin(token: string, range:{
    MinCreatedLocal: string,
    MaxCreatedLocal: string,
}) {
  try {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getAllUserAffiliatesWithTimeAdmin`,
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
        },
        body: JSON.stringify({
        minCreatedLocal: range.MinCreatedLocal,
        maxCreatedLocal: range.MaxCreatedLocal,
        }),
    });

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getPlayerHistory(token: string, userId:string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getPlayerHistory`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ userId: userId }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function getFavPlayers(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/getFavPlayers`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function addPlayerToFavPlayers(token: string, username: string, playerName: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/addToFavPlayers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username, playerName: playerName }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}

export async function removePlayerFromFavPlayers(token: string, username: string, playerName: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/affiliate/removeFromFavPlayers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        },
        body: JSON.stringify({ username: username, playerName: playerName }),
      }
    );

    const data = await response.json();

    return data; // { token, isSuccess, message }
  } catch (error) {
    console.log(error);
    return {
      token: '',
      isSuccess: false,
      message: 'Server error. Please try again.',
    };
  }
}