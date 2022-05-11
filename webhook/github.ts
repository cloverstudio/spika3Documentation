const secret = "your_secret_here";
const repo = "~/your_repo_path_here/";

import http, { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';
import 'dotenv/config';

const port = process.env.WEBHOOK_GITHUB_PORT || 8080;

const SECRET = process.env.WEBHOOK_GITHUB_SECRET;

http.createServer((req: IncomingMessage, res: ServerResponse) => {


    if (req.method == 'POST') {
        console.log('POST')
        var body = ''
        req.on('data', (data) => {
            body += data
        })
        req.on('end', () => {
            console.log('Body: ' + body)
            console.log("request headers", req.headers);
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end('post received')
        })
    } else {
        console.log(req);
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('OK.')
    }


    res.end();
}).listen(port);
console.log(`Server started on port ${port}`)
