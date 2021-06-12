
/* ADMIN LOGIN-LOGOUT-INFO API's */
async function login(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.json();
        throw errDetails.message;
    }
}

async function getUserInfo() {
    const response = await fetch('/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    }
    else throw userInfo;
}

async function logout() {
    let response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.ok) {
        return true;
    }
    else
        return false;
}

const API = {login, getUserInfo, logout};
export default API;