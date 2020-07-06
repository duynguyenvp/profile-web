import express from 'express'
const router = express.Router()
import fs from 'fs';
import path from 'path';

var url = require("url");

router.get('/:name?', (req, res) => {

    var uri = url.parse(req.url).pathname
        , filename = path.join(process.cwd(), uri, 'public/bg-header.mp4');

    // path.exists(filename, function (exists) {
    //     if (!exists) {
    //         res.writeHead(404, { "Content-Type": "text/plain" });
    //         res.write("404 Not Found\n");
    //         res.end();
    //         return;
    //     }
    // })
    const stat = fs.statSync(filename)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        let end = start + (100 * 1024) //100kb
        let maxEnd = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        end = Math.min(end, maxEnd)
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(filename, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(filename).pipe(res)
    }
});

export default router