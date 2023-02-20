import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log('Stories:', data);
}

const showProfile = async (token) => {
    const endpoint = `${rootURL}/api/profile`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
}

const showPosts = async (token) => {
    console.log('code to show posts');
}


const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');

    showProfile();
}

initPage();

