import { setupServer } from 'msw/node';

// No default handlers: each test declares the API it depends on through mockEndpoint.
export const server = setupServer();
