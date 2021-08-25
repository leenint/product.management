const logService = {
  writeLog: async ({
    req,
    body,
    statusCode,
    error,
  }) => {
    if (process.env.NODE_ENV === 'local' && error instanceof Error) {
      console.error(error);
    }
    const { url, method, userId } = req;
    if (statusCode >= 200 && statusCode < 300 &&
      method && typeof method === 'string' && method.toUpperCase() === 'GET') {
      return;
    }

    if (req.url.indexOf('/api/log') !== -1) return;

    console.log({
      url,
      method,
      statusCode,
      query: JSON.stringify(req.query),
      payload: JSON.stringify(req.body),
      response: error instanceof Error ? `${error}` : JSON.stringify(body),
      userId: userId || 0,
      error: error instanceof Error ? error.stack : error,
    });
  },

  error: async (error) => {
    if (process.env.NODE_ENV === 'local' && error instanceof Error) {
      console.error(error);
    }
    console.log({
      url: 'INTERNAL',
      method: 'INTERNAL',
      statusCode: 500,
      userId: 0,
      error: error instanceof Error ? `${error}. ${error.stack}` : error,
    });
  },
};

module.exports = logService;
