process.chdir(__dirname);
import('vite').then(vite => {
  vite.createServer({ server: { port: 3000 } }).then(server => {
    server.listen().then(() => server.printUrls());
  });
});
