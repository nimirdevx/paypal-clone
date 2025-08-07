const API_BASE_URL = "http://localhost:8080";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include", // Important for session-based auth
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid credentials");
      }
      throw new Error(`API Error: ${response.status}`);
    }

    // Handle empty responses (like from credit endpoint)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return {} as T;
  }

  // User Service
  async register(name: string, email: string, password: string) {
    const user = await this.request("/api/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    // Create wallet for new user after successful registration
    await this.request("/api/wallets", {
      method: "POST",
      body: JSON.stringify({ userId: user.id }),
    });

    return user;
  }

  async login(email: string, password: string) {
    return this.request("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Wallet Service
  async createWallet(userId: number) {
    return this.request("/api/wallets", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
  }

  async getWallet(userId: number) {
    return this.request(`/api/wallets/user/${userId}`);
  }

  async addFunds(userId: number, amount: number) {
    return this.request("/api/wallets/credit", {
      method: "POST",
      body: JSON.stringify({ userId, amount }),
    });
  }

  // Transaction Service
  async sendMoney(senderId: number, recipientId: number, amount: number) {
    return this.request("/api/transactions", {
      method: "POST",
      body: JSON.stringify({
        senderId,
        recipientId,
        amount,
      }),
    });
  }

  // Note: You'll need to add this endpoint to your backend
  // or modify the send money flow to work differently
  async getUserByEmail(email: string) {
    return this.request(`/api/users/email/${email}`);
  }

  // Note: You'll need to add this endpoint to your backend
  // to get transactions for a specific user
  async getTransactions(userId: number) {
    return this.request(`/api/transactions/user/${userId}`);
  }
}

export const api = new ApiClient();
