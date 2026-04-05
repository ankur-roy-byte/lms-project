import { createServer } from 'vite';

const server = await createServer({
  root: import.meta.dirname,
  server: { port: 3000 }
});
await server.listen();
server.printUrls();
