const video_wrapper = document.querySelector('#video_wrapper')
const search = document.querySelector('#video_wrapper')

function loadSection(data) {
    let section = document.createElement('section')
    section.innerHTML =
        `<a class="cover" href="/video?id=${data.Id}" style="background-image: url(${data.Cover})"><span>${data.Length}</span></a>
            <a class="title" href="/video?id=${data.Id}">${data.Title}</a>
            <div class="info">
                <span class="views">${data.Views}</span>
                <span class="time">${data.Time.substring(0, 10)}</span>
            </div>
            <a class="author" href="/space/?id=${data.Author}">${data.User.Username}</a>`
    video_wrapper.appendChild(section)
}
function loadResults(data) {
    data.forEach(v => loadSection(v))
}
function init() {
    let keywords = queryToJson().keywords
    search_input.value = keywords
    fetch('https://anonym.ink/api/home/search?keywords=' + keywords)
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                loadResults(json.data)
            } else {
                console.log('搜索失败：', json.data)
            }
        })
}

init()