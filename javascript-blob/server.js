// run `node server.js`

const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const port = process.argv[2] || 9000

http
  .createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`)

    // parse URL
    const parsedUrl = url.parse(req.url)
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext
    // maps file extention to MIME typere
    const map = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',

      '.ico': 'image/x-icon',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',

      '.md': 'text/markdown',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.json': 'application/json',

      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.ts': 'video/mp2t'
    }

    fs.exists(pathname, function (exist) {
      if (!exist) {
        // if the file is not found, return 404
        res.statusCode = 404
        res.end(`File ${pathname} not found!`)
        return
      }

      // if is a directory search for index file matching the extention
      if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext

      // read file from file system
      fs.readFile(pathname, function (err, data) {
        if (err) {
          res.statusCode = 500
          res.end(`Error getting the file: ${err}.`)
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain')
          res.end(data)
        }
      })
    })
  })
  .listen(parseInt(port))

console.log(`Server listening on port ${port}`)
