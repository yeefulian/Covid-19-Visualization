const rapidapi_host = "genius.p.rapidapi.com"
const rapidapi_key = "93a3d4277dmsh75d04b9b70c6cc3p1c8d4ejsn4f4ad66f036e"

export async function api(url = '', method='GET') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            "x-rapidapi-host": rapidapi_host,
            "x-rapidapi-key": rapidapi_key
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}