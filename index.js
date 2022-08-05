const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const friends = []

const dataPanel = document.querySelector('#data-panel')

function renderFriendList (data) {
  let containerHTML = ''
  data.forEach((item) => {
    containerHTML += `
        <div class="card m-2" style="width: 18rem;">
          <img src="${item.avatar}" class="card-img-top" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>` 
  })
  dataPanel.innerHTML = containerHTML
}

axios
  .get (INDEX_URL)
  .then ((res) => {
    friends.push(...res.data.results)
    renderFriendList(friends)
  })
