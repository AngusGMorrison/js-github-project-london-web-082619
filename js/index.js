let searchType;

const searchButtons = document.querySelectorAll(`input[type="submit"]`)
searchButtons.forEach(button => {
  button.addEventListener("click", submitSearch);
});

function submitSearch(event) {
  event.preventDefault();
  searchType = event.target.dataset.searchType;
  searchGithub();
}

function searchGithub() {
  const keyword = document.querySelector("#search").value;
  if (keyword === "") return;
  fetch(`https://api.github.com/search/${searchType}?q=${keyword}`, getRequestConfig())
    .then(response => response.json())
    .then(json => {
      if (searchType === "users") {
        renderUsers(json);
      } else {
        renderRepos(json.items);
      }
    })
    .catch(console.log);
}

function renderUsers(json) {
  const users = json.items
  const userList = document.querySelector("#user-list")
  users.forEach(user => {
    const li = createUserLi(user);
    userList.appendChild(li);
  });
}

function createUserLi(user) {
  const li = document.createElement("li");
  li.appendChild(createUserAvatar(user.avatar_url));
  li.appendChild(createUserProfileLink(user.login, user.html_url));
  li.appendChild(createUserReposButton(user.repos_url));
  return li;
}

function createUserAvatar(avatarURL) {
  const img = document.createElement("img");
  img.src = avatarURL;
  return img;
}

function createUserProfileLink(username, profileURL) {
  const link = document.createElement("a");
  link.textContent = username;
  link.href = profileURL;
  link.target = "_blank";
  return link;
}

function createUserReposButton(reposURL) {
  const button = document.createElement("button");
  button.setAttribute("data-repos-url", reposURL);
  button.textContent = "View repos";
  button.addEventListener("click", getUserRepos);
  return button;
}

function getUserRepos(event) {
  const reposURL = event.target.dataset.reposUrl;
  fetch(reposURL, getRequestConfig())
    .then(response => response.json())
    .then(json => renderRepos(json))
    .catch(console.log);
}

function getRequestConfig() {
  return {
    headers: {
      "Accept": "application/vnd.github.v3+json"
    }
  }
}

function renderRepos(repos) {
  const reposList = document.querySelector("#repos-list");
  repos.forEach(repo => {
    const li = createRepoLi(repo);
    reposList.appendChild(li);
  });
} 

function createRepoLi(repo) {
  const li = document.createElement("li");
  li.innerHTML = `<a href=${repo.html_url} target="_blank">${repo.name}</a>`
  return li;
}