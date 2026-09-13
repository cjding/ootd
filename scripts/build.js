import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const [styles, dataSource, scoringSource, appSource] = await Promise.all([
  readFile('src/styles.css', 'utf8'),
  readFile('src/data.js', 'utf8'),
  readFile('src/scoring.js', 'utf8'),
  readFile('src/app.js', 'utf8'),
]);

// GitHub Pages serves projects from a subdirectory. Bundling the small MVP into
// one document avoids module-path and MIME issues and gives the user a useful
// error message instead of a blank screen if startup ever fails.
const data = dataSource.replaceAll('export const ', 'const ');
const scoring = scoringSource.replaceAll('export function ', 'function ');
const application = appSource.replace(/^import .*;\n/gm, '');
const script = `${data}\n${scoring}\n${application}`.replaceAll('</script>', '<\\/script>');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f4f1eb">
  <meta name="description" content="Daily Edit — your private, weather-aware wardrobe assistant">
  <title>Daily Edit</title>
  <link rel="preconnect" href="https://images.unsplash.com">
  <style>${styles}</style>
</head>
<body>
  <div id="app"><main class="startup">Opening Daily Edit…</main></div>
  <div id="toast" role="status" aria-live="polite"></div>
  <script>
    window.addEventListener('error', (event) => {
      const root = document.querySelector('#app');
      if (root && !root.querySelector('.topbar')) {
        root.innerHTML = '<main class="startup"><h1>Daily Edit could not open.</h1><p>Refresh the page. If this continues, share the message below:</p><code>'
          + String(event.message || 'Unknown startup error').replace(/[&<>]/g, '') + '</code></main>';
      }
    });
  </script>
  <script>${script}</script>
</body>
</html>\n`;

await writeFile('dist/index.html', html);
console.log('Built self-contained static app in dist/index.html');
