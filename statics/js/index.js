const sections = document.querySelectorAll('#main>section')

function loadList(list, data) {
    for (let i = 0; i < 8; i++) {
        if (!data[i]) break
        let article = document.createElement('article')
        article.innerHTML =
            `<a class="cover" href="/video/?id=${data[i].Id}" target="_blank">
                <img src="${data[i].Cover}">
                <div class="info">
                    <span class="views">${data[i].Views}</span>
                    <span class="likes">${data[i].Likes}</span>
                    <span class="length">${data[i].Length}</span>
                </div>
            </a>
            <a class="title" href="/video/?id=${data[i].Id}" target="_blank">${data[i].Title}</a>
            <a class="author" href="/space/?id=${data[i].Author}" target="_blank">${data[i].User.Username}</a>`
        list.appendChild(article)
}
function loadRank(rank, data) {
    for (let i = 0; i < 10; i++) {
        if (!data[i]) break
        let a = document.createElement('a')
        a.setAttribute('href', '/video/?id=' + data[i].Id)
        a.setAttribute('target', '_blank')
        a.innerText = data[i].Title
        rank.appendChild(a)
    }
}
function pwa() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
    }
}
function init(){
    fetch('https://anonym.ink/api/home/sections')
        .then(data => data.json())
        .then(json => {
            sections.forEach((section, i) => {
                if (json.status) {
                    loadList(section.children[2], json.data[i].List)
                    loadRank(section.children[3], json.data[i].Rank)
                } else {
                    console.log("加载主页视频列表及排行失败：", json.data)
                }

            })
        })
}

init()
pwa()