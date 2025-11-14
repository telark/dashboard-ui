export const createRequestErrorHandler = () => {
    return (error: unknown) => {
      return Promise.reject(error);
    };
};