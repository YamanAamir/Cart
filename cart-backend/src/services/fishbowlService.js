const axios = require('axios');

class FishbowlService {
  constructor() {
    this.baseURL = process.env.FISHBOWL_API_URL || 'http://127.0.0.1:2456';
    this.token = null;
  }

  async login() {
    try {
      const response = await axios.post(`${this.baseURL}/api/login`, {
        appName: 'ClubProEcom',
        appDescription: 'E-commerce Integration with Prisma',
        appId: 987654321,
        username: process.env.FISHBOWL_USERNAME,
        password: process.env.FISHBOWL_PASSWORD,
      });

      if (!response.data?.token) {
        throw new Error('No token received from Fishbowl');
      }

      this.token = response.data.token;
      console.log('[Fishbowl] Login successful');
      return this.token;
    } catch (err) {
      console.error('[Fishbowl] Login failed:', err.response?.data || err.message);
      throw new Error('Fishbowl authentication failed');
    }
  }

  async request(method, endpoint, data = null, customHeaders = {}) {
    if (!this.token) {
      await this.login();
    }

    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': customHeaders.contentType || 'application/json',
        ...customHeaders,
      },
      data,
    };

    try {
      const res = await axios(config);
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        console.log('[Fishbowl] Token expired, re-logging in...');
        this.token = null;
        return this.request(method, endpoint, data, customHeaders);
      }

      console.error('[Fishbowl API Error]', {
        endpoint,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      throw err;
    }
  }

  // Import Part (Product)
  async importPart(csvString) {
    return this.request('POST', '/api/import/Part', csvString, {
      contentType: 'text/plain',
    });
  }

  // Import Customer
  async importCustomer(csvString) {
    return this.request('POST', '/api/import/Customer', csvString, {
      contentType: 'text/plain',
    });
  }

  // Import Sales Order
  async importSalesOrder(csvString) {
    return this.request('POST', '/api/import/Sales-Order', csvString, {
      contentType: 'text/plain',
    });
  }

  // Get current inventory quantity for a part
  async getPartInventory(partNumber) {
    const res = await this.request('GET', `/api/parts/inventory?number=${encodeURIComponent(partNumber)}`);
    return Number(res?.results?.[0]?.quantity || 0);
  }
}

module.exports = new FishbowlService();