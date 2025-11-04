const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

async function main() {
  const args = yargs(hideBin(process.argv))
    .option('file', { type: 'string', demandOption: true, describe: 'Path to video file' })
    .option('title', { type: 'string', default: '' })
    .option('description', { type: 'string', default: '' })
    .option('tags', { type: 'string', default: '' })
    .option('platforms', { type: 'string', default: 'youtube,x,linkedin' })
    .option('webhook', { type: 'string', default: 'http://localhost:5678/webhook/agentic-multi-upload' })
    .help()
    .argv;

  const filePath = path.resolve(args.file);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const form = new FormData();
  form.append('video', fs.createReadStream(filePath));
  form.append('title', args.title);
  form.append('description', args.description);
  form.append('tags', args.tags);
  form.append('platforms', args.platforms);

  const headers = form.getHeaders();

  try {
    const res = await axios.post(args.webhook, form, { headers, maxBodyLength: Infinity, maxContentLength: Infinity, timeout: 300000 });
    console.log(res.status, res.statusText);
    console.log(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
  } catch (err) {
    const status = err?.response?.status || '';
    const data = err?.response?.data || err.message;
    console.error(status, data);
    process.exit(1);
  }
}

main();
