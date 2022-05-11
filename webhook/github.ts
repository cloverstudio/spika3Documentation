import http, { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';
import 'dotenv/config';

const port = process.env.WEBHOOK_GITHUB_PORT || 8080;
const SECRET = process.env.WEBHOOK_GITHUB_SECRET;
const repo = process.env.REPOSITOEY_DIR;

http.createServer((req: IncomingMessage, res: ServerResponse) => {


    if (req.method == 'POST') {
        console.log('POST')
        var body = ''
        req.on('data', (data) => {
            body += data
        })
        req.on('end', () => {

            const jsonBody = JSON.parse(body);
            let sig = "sha1=" + crypto.createHmac('sha1', SECRET).update(body.toString()).digest('hex');

            if (req.headers['x-hub-signature'] == sig) {
                console.log("Signature matched start building...")
                exec('cd ' + repo + ' && git pull && npm run build');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end('OK')
        })
    } else {
        console.log(req);
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('OK.')
    }

}).listen(port);
console.log(`Server started on port ${port}`)