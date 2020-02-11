const baseUrl = process.env.NODE_ENV === 'production'
    ? '/api'
    : `http://${window.location.hostname}:3000/api`,


const errHandler = err => {
    console.error(err)
    if (err.response && err.response.data) {
        console.error('API response', err.response.data)
        throw err.response.data.message
    }
    throw err
}

const getBoard = () => {
    fetch(`/${baseUrl}/board`, { method: 'GET' })
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then((response) => {
            console.log(response, 'response')
        })
        .catch(errHandler)
}

const updateBoard = body => {
    fetch(`/${baseUrl}/board`, {
        method: 'PUT',
        body: JSON.stringify({ body }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.ok) {
                console.log('Board updated!');
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(errHandler)
}

