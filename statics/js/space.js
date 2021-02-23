const up_avatar = document.querySelector('#banner>.left>img')
const up_username = document.querySelector('#banner>.left>.userinfo>.username')
const up_statement = document.querySelector('#banner>.left>.statement')
const up_level = document.querySelector('#banner>.left>.userinfo>.level')
const up_uid = document.querySelector('#home>.right>.info>.uid')
const up_birthday = document.querySelector('#home>.right>.info>.birthday')
const up_followings = document.querySelector('#banner_bottom>.right>.followings>.value')
const up_followers = document.querySelector('#banner_bottom>.right>.followers>.value')
const up_likes = document.querySelector('#banner_bottom>.right>.likes>.value')
const up_views = document.querySelector('#banner_bottom>.right>.views>.value')
const tab_home = document.querySelector('#tab_home')
const tab_moments = document.querySelector('#tab_moments')
const tab_post = document.querySelector('#tab_post')
const tab_underline = document.querySelector('#tab_underline')
const follow_button = document.querySelector('#follow')
const video_wrapper = document.querySelector('#video_wrapper')
const video_count = document.querySelector('#video_title>.count')
const queries = queryToJson()
const up = { data: {} }

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
    let upPromise = getUserInfo(queries.id).then(json => {
        if (json.status) {
            up.data = json.data
            document.title = json.data.Username + '的个人空间 - ビリビリ ( ゜- ゜)つロ 乾杯~ Bilibili'
            up_avatar.src = json.data.Avatar
            up_username.textContent = json.data.Username
            up_statement.textContent = json.data.Statement
            up_level.setAttribute('lv', getLevel(json.data.Exp))
            up_uid.textContent = json.data.Uid
            up_birthday.textContent = json.data.Birthday === '9999-12-12' ? '未填写' : json.data.Birthday.substring(5)
            up_followings.textContent = json.data.Followings
            up_followers.textContent = json.data.Followers
            up_likes.textContent = json.data.TotalLikes
            up_views.textContent = json.data.TotalViews
            loadVideos(json.data.Videos)
        } else {
            jumpTo404()
        }
    })
    Promise.all([tokenInit, upPromise]).then(() => {
        fetch('https://anonym.ink/api/user/follow?' + jsonToQuery({
            a: user.data.Uid,
            b: up.data.Uid
        }))
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    if (json.data > 0) {
                        follow_button.classList.add('following')
                        follow_button.textContent = '已关注'
                    }
                } else {
                    console.log('获取关注信息失败：', json.data)
                }
            })
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
    follow_button.addEventListener('click', function () {
        if (user.token === '') {
            alert('请先登录')
        } else if (user.data.Uid === up.data.Uid) {
            alert('你时刻都在关注自己')
        } else {
            fetch('https://anonym.ink/api/user/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: jsonToQuery({
                    uid: up.data.Uid,
                    token: user.token
                })
            })
                .then(data => data.json())
                .then(json => {
                    if (json.status) {
                        if (json.data) {
                            follow_button.classList.add('following')
                            follow_button.textContent = '已关注'
                        } else {
                            follow_button.classList.remove('following')
                            follow_button.textContent = '关注'
                        }
                    } else {
                        console.log('关注/取消关注失败：', json.data)
                    }
                })
            }
    })

    moveUnderline()
}

init()