// frontend/src/api/client.ts

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any, message: string) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  data?: any;
}

export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { data, headers: customHeaders, ...customConfig } = options;

  const token = localStorage.getItem('careeros_access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  // Allow multipart/form-data by deleting Content-Type if body is FormData
  if (data instanceof FormData) {
    delete (headers as Record<string, string>)['Content-Type'];
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
    ...(data ? { body: data instanceof FormData ? data : JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Some endpoints return 202 Accepted without a JSON body or empty response
    if (response.status === 204) {
      return {} as T;
    }

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData,
        responseData?.detail || response.statusText || 'An unexpected error occurred'
      );
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
};
