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

function initUser() {
    getUserInfo(queries.id).then(json => {
        if (json.status) {
            console.log('UP: ', json.data)
            up_avatar.src = json.data.Avatar
            up_username.textContent = json.data.Username
            up_statement.textContent = json.data.Statement
            up_level.setAttribute('lv', getLevel(json.data.Exp))
            up_uid.textContent = json.data.Uid
            up_birthday.textContent = json.data.Birthday === '9999-12-12' ? '未填写' : json.data.Birthday.substring(5)
        } else {
            alert('获取 UP 信息失败：' + json.data)
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