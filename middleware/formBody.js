const fs = require('fs').promises

module.exports = () => (req, res, next) => {
    req.body = {}
    let rawBodyArr = []
    const boundary = req.headers['content-type'].split('boundary=')[1].trim()
    req.on('data', chunk => rawBodyArr.push(chunk.toString('binary')))
    req.on('end', async () => {
        const rawBody = rawBodyArr.join('')
        const lineIndex = rawBody.indexOf('\n')
        const fileData = rawBody.slice(lineIndex, rawBody.indexOf(boundary, lineIndex))
        const filename = /filename="(.+)"/.exec(fileData)[1]
        const windowsPattern = /\r\n\r\n/
        const linuxPattern = /\n\n/
        let match = windowsPattern.exec(fileData)
        if (match == null) match = linuxPattern.exec(fileData)

        if (match) {
            const file = fileData.slice(match.index).trim()
            const prefix = ('00000' + (Math.random() * 9999999 | 0).toString(16)).slice(-5)
            const uniqueFilename = `${prefix}_${filename}`
            await fs.writeFile(`./static/images/${uniqueFilename}`, file, 'binary')
            req.body.image = uniqueFilename
        }
        const textIndex = rawBody.indexOf('Content-Disposition: form-data; name="text"')
        if (textIndex != -1) {
            req.body.text = rawBody.slice(textIndex + 'Content-Disposition: form-data; name="text"'.length, rawBody.indexOf(boundary, textIndex) - 2).trim()
        }
        next()
    });
}