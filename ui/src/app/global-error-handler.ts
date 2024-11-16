const originalConsoleError = console.error;

console.error = (message, ...args) => {
  if (typeof message === 'string' && message.includes('sessionStorage is not defined')) return;
  originalConsoleError(message, ...args);
};
