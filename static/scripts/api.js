const host = 'http://localhost:3000/'

async function request(method, url, body) {
    const options = {
        method,
        headers: {}
    }
    if (body) {
        options.headers['Content-Type'] = 'application/json'
        options.body = JSON.stringify(body)
    }
    try {
        const response = await fetch(host + url, options)
        if (!response.ok) throw new Error(response.message)
        try {
            return await response.json()
        } catch (error) {
            return false
        }
    } catch (error) {
        //window.alert(error.message)
        throw error
    }
}

const get = request.bind(null, 'get')
const post = (url, body) => request('post', url, body)
const put = request.bind(null, 'put')
const del = request.bind(null, 'delete')

export {
    get,
    post,
    put,
    del
}