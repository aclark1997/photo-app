import {
    getAccessToken
} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

let token = undefined;

let uname = undefined;

window.addEventListener("click", async (ev) => {

    if (ev.target.id.includes("comment_")) {
        if (ev.target.value === "Add a comment...") {
            ev.target.value = '';
        }
    }

    if (ev.target.id.includes("postcomment")) {
        const txt = document.querySelector(`#comment_${ev.target.id.split('_')[1]}`).value;

        createComment(Number(ev.target.id.split('_')[1]), txt).then((data) => {
            document.querySelector("#topcomment_" + ev.target.id.split('_')[1]).innerHTML = `
            <b>${uname}</b> ${txt}
            `;

            document.querySelector(`#topcommentdate_${ev.target.id.split('_')[1]}`).innerHTML = "JUST NOW";

            document.querySelector(`#comment_${ev.target.id.split('_')[1]}`).value = '';

            let wordslol = document.querySelector(`#showcomments_${ev.target.id.split('_')[1]}`).innerHTML.split(' ');

            wordslol[1] = Number(wordslol[1]) + 1;

            document.querySelector(`#showcomments_${ev.target.id.split('_')[1]}`).innerHTML = wordslol[0] + " " + wordslol[1] + " " + wordslol[2];

        });
    }

    if (ev.target.innerHTML === 'follow') {
        followUser(ev.target.id).then((data) => {
            ev.target.innerHTML = 'unfollow';
        });
    } else if (ev.target.innerHTML === 'unfollow') {
        unfollowUser(ev.target.id).then((data) => {
            ev.target.innerHTML = 'follow';
        });
    }

    if (ev.target.id.includes("bookmark")) {
        if (ev.target.className === 'fa-regular fa-bookmark') {
            createBookmark(ev.target.id.split('_')[1]).then((data) => {
                ev.target.className = 'fa-solid fa-bookmark';
            });

            let posts = await getPosts(token);
            posts.forEach((post) => {
                if (post.id === Number(ev.target.id.split('_')[1])) {
                    ev.target.setAttribute("data-bookmarkid", post.current_user_bookmark_id);
                }
            });
        } else {
            deleteBookmark(ev.target.getAttribute("data-bookmarkid")).then((data) => {
                ev.target.className = 'fa-regular fa-bookmark';
            });
        }
    }

    if (ev.target.id.includes("like")) {
        if (ev.target.className === 'fa-regular fa-heart') {
            createLike(ev.target.id.split('_')[1]).then((data) => {
                ev.target.className = 'fa-solid fa-heart';
                let likes = document.querySelector(`#likes_${ev.target.id.split('_')[1]}`).innerHTML;
                likes = likes.replace("<b>", "");
                likes = likes.replace("</b>", "");


                likes = Number(likes.split(" ")[0])
                document.querySelector(`#likes_${ev.target.id.split('_')[1]}`).innerHTML = `<b>${likes + 1} likes</b>`;
            });

            let posts = await getPosts(token);
            posts.forEach((post) => {
                if (post.id === Number(ev.target.id.split('_')[1])) {
                    ev.target.setAttribute("data-likeid", post.current_user_like_id);
                }
            });
        } else {
            deleteLike(ev.target.getAttribute('data-likeid')).then((data) => {
                ev.target.className = 'fa-regular fa-heart';
                let likes = document.querySelector(`#likes_${ev.target.id.split('_')[1]}`).innerHTML;
                likes = likes.replace("<b>", "");
                likes = likes.replace("</b>", "");


                likes = Number(likes.split(" ")[0])
                document.querySelector(`#likes_${ev.target.id.split('_')[1]}`).innerHTML = `<b>${likes - 1} likes</b>`;
            });
        }
    }

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

const createComment = async (id, text) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/comments/`;
    const postData = {
        "post_id": id, // replace with the actual post ID
        "text": text,
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
}

const createBookmark = async (id) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/bookmarks/`;
    const postData = {
        "post_id": id // replace with the actual post ID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
}

const deleteBookmark = async (id) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/bookmarks/${id}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
}

const createLike = async (id) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/posts/likes/`;
    const postData = {
        "post_id": id // replace with the actual post ID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
}

const deleteLike = async (id) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/posts/likes/${id}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
}

const followUser = async (id) => {
    const endpoint = `${rootURL}/api/following/`;
    const postData = {
        "user_id": id // replace with the actual post ID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
}

const unfollowUser = async (id) => {
    // define the endpoint:
    const endpoint = `${rootURL}/api/following/${id}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
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
    uname = data.username;
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
        <div style="margin-top: -45px; margin-left: 50;">
          <p>${suggie.username}</p>
          <p style="font-size: 12px; margin-top: -15px; color: rgb(131, 131, 131);">suggested for you</p>
          <a class="linkbutton"><p style="display: flex; margin-left: 150px; font-size: 14px; color: rgb(14, 122, 254); margin-top: -40px;" id=${suggie.id}>follow</p></a>
        </div>
      </div>
        `;
    });
}

const getPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();

    return data;
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

        document.querySelector("#feed").innerHTML += `    <div id="card_${post.id}" class="card">
        <span style="box-shadow: -1px -1px 3px 3px lightgray; display: flex; flex-direction: row;">
          <h4>${post.user.username}</h4>
          <h4 style="display: flex; margin-left: auto; margin-right: 10px;">...</h4>
        </span>
        <img style="width: 100%; height: 50vh" src="${post.image_url}" />
        <span style="display: flex; flex-direction: row;">
          <a class="nostylelink" href="javascript: 1"><i data-likeid=${post.current_user_like_id} id="like_${post.id}" style="padding: 10px; font-size: 24px;" class="${post.current_user_like_id !== undefined ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i></a>
          <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;" class="fa-regular fa-comment"></i></a>
          <a class="nostylelink" href=""><i style="padding: 10px; font-size: 24px;"
              class="fa-regular fa-paper-plane"></i></a>
          <p style="display: flex; margin-left: auto;"><a href="javascript: 1" class="nostylelink"><i
                data-bookmarkid=${post.current_user_bookmark_id} id="bookmark_${post.id}" style="padding: 10px; font-size: 24px; " class="${post.current_user_bookmark_id !== undefined ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}"></i></a></p>
        </span>
        <div style="margin-left: 12px;">
          <p id="likes_${post.id}" style="margin-top: -20px;"><b>${post.likes.length} likes</b></p>
          <p><b>${post.user.username}</b> ${post.caption}</p>
        </div>

        <a id="showcomments_${post.id}" data-postid=${post.id} style="margin-left: 15px" class="linkbutton">Show ${post.comments.length} comments</a>
        <br />
        <p id="topcomment_${post.id}" style="margin-left: 15px"><b>${post.comments[0] != undefined ? post.comments[0].user.username : ""}</b> ${post.comments[0] != undefined ? post.comments[0].text : ""}</p>
        <p id="topcommentdate_${post.id}" style="margin-left: 15px; margin-top: -10px; font-size: 10px; color: darkgray;">${post.comments[0] != undefined ? post.comments[0].display_time.toUpperCase() : ""}</p>

        <hr />
        <span style="display: flex; flex-direction: row;">
  
  
  
          <a class="nostylelink" href=""><i style="margin-left: 10px; font-size: 24px; margin-top: 10px;"
              class="fa-regular fa-face-smile"></i></a>
          <input id="comment_${post.id}" style="border: none; margin-left: 5px; color: darkgray" value="Add a comment..." type="text" />
          <p style="display: flex; margin-left: auto; margin-right: 10px;"><a href="javascript: 1" class="nostylelink"
              style=" color: 	rgb(14, 122, 254);" id="postcomment_${post.id}">Post</a></p>
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
