import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';


document.addEventListener("click", (ev) => {
    console.log("!");
});

const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    

    data.forEach(story => {
        document.querySelector("#stories").innerHTML += `
        <div style="width: fit-content; text-align: center;" id="story">
        <img style="width: 50px; height: 50px; border-radius: 50%;" src="${story.user.image_url}" />
        <p>${story.user.username}</p>
      </div>
        `;
    });
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
        document.querySelector("#suggies").innerHTML += `
        <div>
        <img style="border-radius: 50%; width: 40px; height: 40px;" src="${suggie.image_url}" />
        <div style="margin-top: -45px; margin-left: 50;">
          <p>${suggie.username}</p>
          <p style="font-size: 12px; margin-top: -15px; color: rgb(131, 131, 131);">suggested for you</p>
          <a class="linkbutton" href=""><p style="display: flex; margin-left: 150px; font-size: 14px; color: rgb(14, 122, 254); margin-top: -40px;">follow</p></a>
        </div>
      </div>
        `;
    });
}

const showPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();

    
    data.forEach(post => {

        let comments = ``;

        post.comments.forEach(comment => {
            
        });

        document.querySelector("#feed").innerHTML += `    <div class="card">
        <span style="box-shadow: -1px -1px 3px 3px lightgray; display: flex; flex-direction: row;">
          <h4>${post.user.username}</h4>
          <h4 style="display: flex; margin-left: auto; margin-right: 10px;">...</h4>
        </span>
        <img style="width: 100%; height: 50vh" src="${post.user.image_url}" />
        <span style="display: flex; flex-direction: row;">
          <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;" class="fa-regular fa-heart"></i></a>
          <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;" class="fa-regular fa-comment"></i></a>
          <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;"
              class="fa-regular fa-paper-plane"></i></a>
          <p style="display: flex; margin-left: auto;"><a class="nostylelink" href=""><i
                style="padding: 10px; font-size: 24px; " class="fa-regular fa-bookmark"></i></a></p>
        </span>
        <div style="margin-left: 12px;">
          <p style="margin-top: -20px;"><b>${post.likes.length} likes</b></p>
          <p><b>${post.user.username}</b> ${post.caption}</p>
        </div>

        <a style="margin-left: 15px" class="linkbutton" onclick="viewComments(${post.id})">Show ${post.comments.length} comments</a>
        <br />
        <p style="margin-left: 15px"><b>${post.comments[0] != undefined ? post.comments[0].user.username : ""}</b> ${post.comments[0] != undefined ? post.comments[0].text : ""}</p>
        <p style="margin-left: 15px; margin-top: -10px; font-size: 10px; color: darkgray;">${post.comments[0] != undefined ? post.comments[0].display_time.toUpperCase() : ""}</p>

        <hr />
        <span style="display: flex; flex-direction: row;">
  
  
  
          <a class="nostylelink" href=""><i style="margin-left: 10px; font-size: 24px; margin-top: 10px;"
              class="fa-regular fa-face-smile"></i></a>
          <input style="border: none; margin-left: 5px; color: darkgray" value="Add a comment..." type="text" />
          <p style="display: flex; margin-left: auto; margin-right: 10px;"><a class="nostylelink"
              style=" color: 	rgb(14, 122, 254);" href="">Post</a></p>
        </span>
      </div>`
    });

    console.log(data);
}

const initPage = async () => {
    document.querySelector("#commentsmodal").style.display = "none";
    document.querySelector("#modalbackdrop").style.display = "none";
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showProfile(token);
    showSuggestions(token);
}

initPage();