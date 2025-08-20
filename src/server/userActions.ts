"use server"

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
