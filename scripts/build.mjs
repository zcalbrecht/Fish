import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {build} from 'esbuild';

const html = await readFile('index.html', 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)];
const source = (await Promise.all(scripts.map(([, file]) => readFile(file, 'utf8')))).join('\n');
await mkdir('dist', {recursive: true});
await build({
    stdin: {contents: source, resolveDir: process.cwd()},
    outfile: 'dist/pond.js',
    bundle: true,
    format: 'iife',
    target: 'es2022',
    minify: true,
    legalComments: 'none'
});
await build({entryPoints: ['style.css'], outfile: 'dist/style.css', minify: true});
await writeFile('dist/index.html', html.replace(/    <script src="[^"]+"><\/script>\r?\n/g, '')
    .replace('</body>', '    <script src="pond.js"></script>\n</body>'));
