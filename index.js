const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
const INDEX_URL = BASE_URL + 'api/v1/users/'
const friends = []
const FRIENDS_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const paginatior = document.querySelector('#paginatior')
const searchfrom = document.querySelector('#search-form')
const serachInput = document.querySelector('#search-input')

// 渲染出好友
function renderFriendList (data) {
  let containerHTML = '' // 建立空字串, 用來儲存模板
  data.forEach((item) => {
    containerHTML += `
        <div class="card m-2" style="width: 18rem;">
          <img src="${item.avatar}" class="card-img-top" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <a href="#" class="btn btn-primary">+</a>
            <a href="#" class="btn btn-primary">send message</a>
            </div>
        </div>` 
  })
  dataPanel.innerHTML = containerHTML
}

// 取出特定頁面資料
function getFriendsByPage(page) {
  const startIndex = (page-1) * FRIENDS_PER_PAGE // 計算起始 Index
  return friends.slice(startIndex, startIndex + FRIENDS_PER_PAGE) // 回傳切割後的新陣列
}

// 渲染出分頁
function renderPaginatior(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE) //  輸入的值除以12, 並用ceil方法得到總頁數
  let rawHTML = '' // 建立空字串, 用來儲存模板
  
  // 加上左邊箭頭
  rawHTML += `<li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" data-page-left="page-left">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>`

  // 迴圈產生分頁編號
  for (let page = 1; page <= numberOfPages; page ++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  // 加上右邊箭頭
  rawHTML += `<li class="page-item">
                <a class="page-link" href="#" aria-label="Next" data-page-right="page-right">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>`

  paginatior.innerHTML = rawHTML // 放入 paginatior
}

// 新增監聽器在搜尋列上
searchfrom.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault() // 停止瀏覽器預設行為, 不刷新頁面

  const keyword = serachInput.value.trim().toLowerCase() // 新增變數儲存輸入text, 並轉去掉前後空白字元再轉換成小寫
  let filterFriends = []

  if (!keyword.length) { // 若輸入字串長度為 0
    return alert('請輸入文字!')
  }

  /*
  // 1. 用 for of 迴圈的方式把資料推入
  for (const friend of friends) {
    if(friend.name.toLowerCase().includes(keyword)){ // 如果清單的 name 屬性包含 keyword 的字串為 ture 時
      filterFriends.push(friend) // 把該筆資料推入 filterFriends
    }
  }
  */

  // 2. 用 filter 條件函式檢查, 吻合條件才會被保留並回傳新陣列
  filterFriends = friends.filter(friend => friend.name.toLowerCase().includes(keyword)) // 若 name 的值部分與 keyword 匹配, 則將該筆資料保留並回傳至陣列

  renderFriendList(filterFriends) // 更新顯示清單
})

// 新增監聽器在 paginatior 上
paginatior.addEventListener('click', function onPaginatiorClicked(event) {
  if (event.target.tagName !== 'A') return // 如果點擊到非目標就離開

  const page = Number(event.target.dataset.page) // 透過 dataset 取得點擊頁數
  renderFriendList(getFriendsByPage(page)) // 更新名單
})

axios
  .get (INDEX_URL)
  .then ((res) => {
    friends.push(...res.data.results)
    renderPaginatior(friends.length) // 渲染分頁編號
    renderFriendList(getFriendsByPage(1)) // 取得分頁資料後渲染名單 (預設從第1頁開始)
  })