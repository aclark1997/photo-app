import {
    getAccessToken
} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

let token = undefined;

window.addEventListener("click", async (ev) => {
    console.log(ev.target);
    if (ev.target.innerHTML.includes('Show') && ev.target.className === 'linkbutton') {
        document.querySelector("#commentsmodal").style = 'display: show';
        document.querySelector("#modalbackdrop").style = 'display: show';

        const endpoint = `${rootURL}/api/posts`;
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        const data = await response.json();
        let targetPost = null;
        data.forEach((post) => {
            if (post.id == Number(ev.target.getAttribute("data-postid"))) {
                targetPost = post;
                document.querySelector("#commentsmodal").innerHTML = `<img style='width: 70%; height: 100%;' src='${post.image_url}' />`;
                document.querySelector("#commentsmodal").innerHTML += `<div style='display: flex; flex-direction: row; position: absolute; left: 71%; top: 1%;'>
                <img style='margin-left: -10px; margin-top: 15px; margin-right: 10px; border-radius: 50%; width: 40px; height: 40px;' src='${post.user.image_url}' />
                <p style='font-size: 24px;'><b>${post.user.username}</b></p>
                </div>
                `;

                document.querySelector("#commentsmodal").innerHTML += `
                <div style='position: absolute; left: 71%; top: 12%; overflow-y: scroll; height: 88%;' id='modalcontent'>

                </div>
                `;

                document.querySelector("#modalcontent").innerHTML = `
                <div>
                    <img style='border-radius: 50%; width: 40px; height: 40px;' src='${post.user.image_url}' /> 
                <p style='margin-top: -25px; margin-left: 45px;'><b>${post.user.username}</b> <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;" class="fa-regular fa-heart"></i></a></p>
                <div style='overflow-wrap: break-word;'>
                    ${post.caption}
                </div>
                <p>${post.display_time}</p>
                <br />
                
                </div>
                `;

                post.comments.forEach((comment) => {
                    document.querySelector("#modalcontent").innerHTML += `
                    <img style='border-radius: 50%; width: 40px; height: 40px;' src='${comment.user.image_url}' /> 
                    <p style='margin-top: -25px; margin-left: 45px;'><b>${comment.user.username}</b> <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;" class="fa-regular fa-heart"></i></a></p>
                    <div style='overflow-wrap: break-word;'>
                        ${comment.text}
                    </div>
                    <p>${comment.display_time}</p>
                    <br />
                    `;
                });

                let all = document.querySelectorAll("*");
                for (let i = 0; i < all.length; i++) {
                    if (document.querySelector("#commentsmodal").contains(all[i])) {
                        all[i].setAttribute('tabindex', '999');
                    }
                }
            }
        });


        targetPost.comments.forEach((comment) => {

        });
    }
    if (ev.target.id === 'closemodal') {
        document.querySelector("#commentsmodal").style = 'display: none';
        document.querySelector("#modalbackdrop").style = 'display: none';
    }
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
        <img style="border-radius: 50%; width: 50px; height: 50px; border-radius: 50%;" src="${story.user.image_url}" />
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

        document.querySelector("#feed").innerHTML += `    <div class="card">
        <span style="box-shadow: -1px -1px 3px 3px lightgray; display: flex; flex-direction: row;">
          <h4>${post.user.username}</h4>
          <h4 style="display: flex; margin-left: auto; margin-right: 10px;">...</h4>
        </span>
        <img style="width: 100%; height: 50vh" src="${post.image_url}" />
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

        <a data-postid=${post.id} style="margin-left: 15px" class="linkbutton">Show ${post.comments.length} comments</a>
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
    token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    showStories(token);
    showPosts(token);
    showProfile(token);
    showSuggestions(token);
}

initPage();
