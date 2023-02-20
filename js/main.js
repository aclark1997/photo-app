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
    document.querySelector("#bannername").innerHTML = data.username;
    document.querySelector("#avi").src = data.image_url;
    document.querySelector("#username").innerHTML = `<p style="margin-right: 10px;"><b>${data.username}</b></p>`;
}

const showSuggestions = async (token) => {
    const endpoint = `${rootURL}/api/suggestions`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    
    data.forEach(suggie => {
        console.log(suggie);
        document.querySelector("#suggies").innerHTML += `
        <div>
        <img style="border-radius: 50%; width: 40px; height: 40px;" src="${suggie.image_url}" />
        <div style="margin-top: -45px; margin-left: 3%;">
          <p>${suggie.username}</p>
          <p style="font-size: 12px; margin-top: -15px; color: rgb(131, 131, 131);">suggested for you</p>
          <a class="linkbutton" href=""><p style="display: flex; margin-left: 150px; font-size: 14px; color: rgb(14, 122, 254); margin-top: -40px;">follow</p></a>
        </div>
      </div>
        `;
    });
}

const showPosts = async (token) => {
    console.log('code to show posts');
}


const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showProfile(token);
    showSuggestions(token);
}

initPage();
