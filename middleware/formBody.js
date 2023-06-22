const fs = require('fs').promises

module.exports = () => (req, res, next) => {
    req.body = {
        postImages: []
    }
    let rawBodyArr = []
    let currentData = ''
    const boundary = req.headers['content-type'].split('boundary=')[1].trim()
    req.on('data', chunk => {
        rawBodyArr.push(chunk.toString('binary'))
    })
    req.on('end', async () => {
        currentData = rawBodyArr.join('')
        while (currentData.includes(boundary) && currentData.includes(boundary, currentData.indexOf(boundary) + 1)) {
            const currentProperty = currentData.slice(currentData.indexOf(boundary), currentData.indexOf(boundary, currentData.indexOf(boundary) + 1))
            const fieldName = /name="([^"]*)/.exec(currentProperty.slice(currentProperty.indexOf('\n', currentProperty.indexOf(boundary))))[1]
            const lineIndex = currentProperty.indexOf('\n')
            const rawData = currentProperty.slice(lineIndex)
            const windowsPattern = /\r\n\r\n/
            const linuxPattern = /\n\n/
            let match = windowsPattern.exec(rawData)
            if (match == null) match = linuxPattern.exec(rawData)
            try {
                const contentType = /Content-Type: (.+)\//.exec(currentProperty.slice(currentProperty.indexOf('\n', currentProperty.indexOf(boundary))))[1]
                if (contentType == 'image') {
                    const filename = /filename="(.+)"/.exec(rawData)[1]
                    if (match) {
                        const file = rawData.slice(match.index).trim()
                        const prefix = ('00000' + (Math.random() * 9999999 | 0).toString(16)).slice(-5)
                        const uniqueFilename = `${prefix}_${filename}`
                        await fs.writeFile(`./static/images/${uniqueFilename}`, file, 'binary')
                        req.body.postImages.push(uniqueFilename)
                        console.log(uniqueFilename);
                    }
                }
            } catch (error) {
                if (match) {
                    req.body[fieldName] = rawData.slice(match.index, - 2).trim()
                }
            }
            currentData = currentData.slice(currentProperty.length)
        }
        next()
    });
}