export async function request(
    url: string,
    { method = 'GET', data = null, headers = {} }: { method?: string; data?: any; headers?: Record<string, string> } = {}
  ) {
    const config: RequestInit = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      mode: 'cors',
      cache: 'default',
    };
  
    let fullUrl = url;
    if (method.toUpperCase() === 'GET' && data) {
      const params = new URLSearchParams(data).toString();
      fullUrl = `${url}${url.includes('?') ? '&' : '?'}${params}`;
    } else if (data) {
      config.body = JSON.stringify(data);
    }
  
    let res;
    try {
      res = await fetch(fullUrl, config);
    } catch (networkError) {
      throw new Error(`Network error: ${networkError.message}`);
    }
  
    const contentType = res.headers.get('Content-Type') || '';
    let result;
    if (contentType.includes('application/json')) {
      result = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`Expected JSON but got: ${text}`);
    }
  
    if (!res.ok) {
      throw new Error(result.error || `Error ${res.status}`);
    }
  
    return result;
  }
  