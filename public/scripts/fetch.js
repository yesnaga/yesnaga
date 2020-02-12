/* const baseUrl = process.env.NODE_ENV === 'production'
    ? '/api'
    : `http://${window.location.hostname}:3000/api`
 */

const errHandler = err => {
    console.error(err)
    if (err.response && err.response.data) {
        console.error('API response', err.response.data)
        throw err.response.data.message
    }
    throw err
}

const getBoard = async () => {

    const response = await fetch(`/api/board`, { method: 'GET' })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('Request failed.');
        })
        .then(data => {
            return data
        })
        .catch(errHandler)
    return await response
}

const updateBoard = (body = 42) => {
    fetch(`/api/board`, {
        method: 'POST',
        body: JSON.stringify({ body }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            throw new Error('Request failed.')
        })
        .then(data => {
            console.log(data, 'data')
        })
        .catch(errHandler)
}

