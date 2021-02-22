const up_avatar = document.querySelector('#banner>.left>img')
const up_username = document.querySelector('#banner>.left>.userinfo>.username')
const up_statement = document.querySelector('#banner>.left>.statement')
const up_level = document.querySelector('#banner>.left>.userinfo>.level')
const up_uid = document.querySelector('#home>.right>.info>.uid')
const up_birthday = document.querySelector('#home>.right>.info>.birthday')
const tab_home = document.querySelector('#tab_home')
const tab_moments = document.querySelector('#tab_moments')
const tab_post = document.querySelector('#tab_post')
const tab_underline = document.querySelector('#tab_underline')
const video_wrapper = document.querySelector('#video_wrapper')
const video_count = document.querySelector('#video_title>.count')
const queries = queryToJson()

function moveUnderline(left = getInitTabLeft()) {
    tab_underline.style.left = left
}
function getInitTabLeft() {
    switch (queries.tab) {
        case 'home': return '15px';
        case 'moments': return '96px';
        case 'post': return '177px';
        default: return '15px';
    }
}
function loadVideos(data) {
    video_count.textContent = data.length
    data.forEach((v,i) => {
        let section = document.createElement('section')
        section.innerHTML =
            `<a class="cover" href="/video/?id=${v.Id}">
                <img src="${v.Cover}">
                <span class="length">${v.Length}</span>
            </a>
            <a class="title" href="/video/?id=${v.Id}">
                <span>${v.Title}</span>
            </a>
            <span class="views">${v.Views}</span>
            <span class="time">${formatDate(v.Time)}</span>`
        video_wrapper.appendChild(section)
    })
}
function formatDate(time) {
    let theDate = new Date(time)
    let nowDate = new Date()
    let difference = nowDate.getTime() - theDate.getTime()
    if (difference < 60000) {
        return Math.floor(difference / 1000) + '秒前'
    } else if (difference < 3600000) {
        return Math.floor(difference / 60000) + '分钟前'
    } else if (difference < 86400000) {
        return Math.floor(difference / 3600000) + '小时前'
    } else if (difference < 172800000) {
        return '昨天'
    } else if (theDate.getFullYear() === nowDate.getFullYear()){
        return `${theDate.getMonth() + 1}-${theDate.getDate()}`
    } else {
        return `${theDate.getFullYear()}-${theDate.getMonth() + 1}-${theDate.getDate()}`
    }
}

function initUser() {
    getUserInfo(queries.id).then(json => {
        if (json.status) {
            console.log('UP: ', json.data)
            document.title = json.data.Username + '的个人空间 - ビリビリ ( ゜- ゜)つロ 乾杯~ Bilibili'
            up_avatar.src = json.data.Avatar
            up_username.textContent = json.data.Username
            up_statement.textContent = json.data.Statement
            up_level.setAttribute('lv', getLevel(json.data.Exp))
            up_uid.textContent = json.data.Uid
            up_birthday.textContent = json.data.Birthday === '9999-12-12' ? '未填写' : json.data.Birthday.substring(5)
            loadVideos(json.data.Videos)
        } else {
            jumpTo404()
        }
    })
}
function init() {
    initUser()

    tab_home.addEventListener('mouseover', () => moveUnderline('15px'))
    tab_moments.addEventListener('mouseover', () => moveUnderline('96px'))
    tab_post.addEventListener('mouseover', () => moveUnderline('177px'))
    tab_home.addEventListener('mouseout', () => moveUnderline())
    tab_moments.addEventListener('mouseout', () => moveUnderline())
    tab_post.addEventListener('mouseout', () => moveUnderline())

    tab_home.addEventListener('click', function () {
        queries.tab = 'home'
        history.pushState(null, null, `/space/?${jsonToQuery(queries)}`)
        tab_home.classList.add('now_tab')
        tab_moments.classList.remove('now_tab')
        tab_post.classList.remove('now_tab')
    })
    tab_moments.addEventListener('click', function () {
        queries.tab = 'moments'
        history.pushState(null, null, `/space/?${jsonToQuery(queries)}`)
        tab_home.classList.remove('now_tab')
        tab_moments.classList.add('now_tab')
        tab_post.classList.remove('now_tab')
    })
    tab_post.addEventListener('click', function () {
        queries.tab = 'post'
        history.pushState(null, null, `/space/?${jsonToQuery(queries)}`)
        tab_home.classList.remove('now_tab')
        tab_moments.classList.remove('now_tab')
        tab_post.classList.add('now_tab')
    })

    moveUnderline()
}

init()