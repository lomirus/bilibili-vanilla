const video_id = parseInt(getQuery().id)
const main = document.querySelector('#main')
const video_area = document.querySelector('#video_area')
const video = document.querySelector('video')
const video_title = document.querySelector('#top>h1')
const video_time = document.querySelector('#top>.time')
const video_playNumber = document.querySelector('#top>.play_number')
const video_danmakuNumber = document.querySelector('#top>.danmaku_number')
const bottom_audienceNumber = document.querySelector('#video_area>.bottom>.info>.audience_number')
const bottom_danmakuNumber = document.querySelector('#video_area>.bottom>.info>.danmaku_number')
const toolbar_likes = document.querySelector('#toolbar>.main>.likes')
const toolbar_coins = document.querySelector('#toolbar>.main>.coins')
const toolbar_saves = document.querySelector('#toolbar>.main>.saves')
const toolbar_shares = document.querySelector('#toolbar>.main>.shares')
const controls_process = document.querySelector('#video_wrapper>.controls>.process')
const controls_process_played = document.querySelector('#video_wrapper>.controls>.process>.played')
const controls_process_icon = document.querySelector('#video_wrapper>.controls>.process>.icon')
const controls_play = document.querySelector('#video_wrapper>.controls>.bottom>.left>img')
const controls_location = document.querySelector('#video_wrapper>.controls>.bottom>.left>.location')
const controls_speed = document.querySelector('#video_wrapper>.controls>.bottom>.right>#speed')
const controls_mute = document.querySelector('#video_wrapper>.controls>.bottom>.right>#mute')
const controls_pip = document.querySelector('#video_wrapper>.controls>.bottom>.right>#pip')
const controls_wide = document.querySelector('#video_wrapper>.controls>.bottom>.right>#wide')
const danmaku_area = document.querySelector('#video_wrapper>.danmaku_area')
const danmaku_switch = document.querySelector('#video_area>.bottom>.control>.switch')
const danmaku_font_settings = document.querySelector('#video_area>.hover>.font_settings')
const danmaku_font_switch = document.querySelector('#video_area>.bottom>.control>.send>.edit>div')
const danmaku_send = document.querySelector('#video_area>.bottom>.control>.send button')
const danmaku_input = document.querySelector('#video_area>.bottom>.control>.send input')
const danmaku_type = {
    'scroll': document.querySelector('.font_settings>.type>.scroll'),
    'top': document.querySelector('.font_settings>.type>.top'),
    'bottom': document.querySelector('.font_settings>.type>.bottom'),
}
const recommend = document.querySelector('#recommend')
const color_input = document.querySelector('.font_settings>.color>.edit>input')
const color_preview = document.querySelector('.font_settings>.color>.edit>div')
const color_list = document.querySelector('.font_settings>.color>.list').children
let chosen_danmaku_type = 'scroll'

class Danmaku {
    constructor(v) {
        let danmaku = document.createElement('div')
        danmaku.classList.add('danmaku')
        danmaku.innerText = v.value;
        danmaku.danmaku_id = v.id;
        danmaku.style.color = '#' + v.color;
        danmaku.style.top = Danmaku.initTop()
        danmaku.style.left = Danmaku.initLeft()
        danmaku_area.appendChild(danmaku)
        danmaku.onanimationend = () => {
            danmaku_area.removeChild(danmaku)
        }
    }
    static initTop() {
        return Math.floor(Math.random() * 18) * 28 + "px"
    }
    static initLeft() {
        return '0'
    }
}

function loadRecommend(data) {
    data.forEach(v => {
        let section = document.createElement('section')
        section.innerHTML =
            `<div><img alt="${v.title}" src="${v.cover}"></div>` +
            `<p class="title">${v.title}</p>` +
            `<p class="author">${v.author}</p>` +
            `<p class="data"><span class="play_number">${v.play_number}</span>` +
            `<span class="danmaku_number">${v.danmaku_number}</span></p>`
        recommend.appendChild(section)
    })
}
function loadDanmaku(data) {
    video.addEventListener('timeupdate', () => {
        data
            .filter(v => Math.floor(video.currentTime) === v.location)
            .forEach(v => {
                if ([...danmaku_area.children].some(element => element.danmaku_id === v.id))
                    return;
                new Danmaku(v);
            })
    })
}
function switchVideoPlayStatus() {
    if (video.paused) {
        video.play()
    } else {
        video.pause()
    }
}
function switchDanmakuStatus() {
    if (danmaku_switch.classList.contains('on')) {
        danmaku_switch.classList.remove('on')
        danmaku_switch.classList.add('off')
        danmaku_area.style.visibility = 'hidden'
    } else {
        danmaku_switch.classList.remove('off')
        danmaku_switch.classList.add('on')
        danmaku_area.style.visibility = 'visible'
    }
}
function switchMuteStatus() {
    if (video.muted) {
        video.muted = false
        controls_mute.src = '/statics/images/video/controls-mute.svg'
        controls_mute.title = '开启静音'
    } else {
        video.muted = true
        controls_mute.src = '/statics/images/video/controls-unmute.svg'
        controls_mute.title = '取消静音'
    }
}
function switchPIPStatus() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture()
    }
}
function switchPlaySpeed() {
    switch (video.playbackRate) {
        case 1:
            video.playbackRate = 1.25
            controls_speed.textContent = '1.25x'
            break;
        case 1.25:
            video.playbackRate = 1.5
            controls_speed.textContent = '1.5x'
            break;
        case 1.5:
            video.playbackRate = 2
            controls_speed.textContent = '2.0x'
            break;
        case 2:
            video.playbackRate = 0.5
            controls_speed.textContent = '0.5x'
            break;
        case 0.5:
            video.playbackRate = 0.75
            controls_speed.textContent = '0.75x'
            break;
        default:
            video.playbackRate = 1
            controls_speed.textContent = '倍速'
            break;
    }
}
function switchWide() {
    if (main.classList.contains('normal')) {
        main.classList.remove('normal')
        main.classList.add('wide')
        controls_wide.src = '/statics/images/video/controls-wideExit.svg'
        controls_wide.title = '退出宽屏'
    } else if (main.classList.contains('wide')) {
        main.classList.remove('wide')
        main.classList.add('normal')
        controls_wide.src = '/statics/images/video/controls-wide.svg'
        controls_wide.title = '宽屏模式'
    }
    danmaku_area.innerHTML = ''
}
function changeDanmakuType(type) {
    for (let i in danmaku_type) {
        if (i === type) {
            danmaku_type[i].classList.add('chosen')
        } else {
            danmaku_type[i].classList.remove('chosen')
        }
    }
    chosen_danmaku_type = type
}
function changeDanmakuColor(color) {
    color_input.value = rgbToHex(color)
    color_preview.style.backgroundColor = color
}

function rgbToHex(rgb) {
    return '#' + rgb.slice(4, -1).split(', ').map(v => {
        const hex = parseInt(v).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
}
function checkHex(hex) {
    if (hex.length !== 7)
        return false
    if (hex[0] !== '#')
        return false
    return hex.substring(1).every(v => '0123456789ABCDEF'.includes(v))
}
function formatDuration(duration) {
    duration = Math.floor(duration)
    let sec = duration % 60
    let min = (duration - sec) / 60
    if (sec < 10) {
        sec = '0' + sec
    }
    if (min < 10) {
        min = '0' + min
    }
    return `${min}:${sec}`
}
function getQuery() {
    const query = window.location.search.substring(1).split('&').map(v => v.split('=')), json = {}
    query.forEach(v => json[v[0]] = v[1])
    return json
}
function initVideo() {
    fetch('https://anonym.ink/api/video/video?video_id=' + video_id, {
        method: 'GET'
    })
        .then(data => data.json())
        .then(json => {
            console.log(json)
            if (!json.status) {
                window.location.href = '/404/'
                return
            }
            if (!json.data.danmaku) json.data.danmaku = []
            document.title = json.data.title + '_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili'
            video_title.textContent = json.data.title
            video_time.textContent = json.data.time
            video_playNumber.textContent = json.data.views
            video_danmakuNumber.textContent = json.data.danmaku.length
            bottom_danmakuNumber.textContent = json.data.danmaku.length
            toolbar_likes.textContent = json.data.likes
            toolbar_coins.textContent = json.data.coins
            toolbar_saves.textContent = json.data.saves
            toolbar_shares.textContent = json.data.shares
            video.src = json.data.video
            video.poster = json.data.cover
        })
}

function init() {
    initVideo()
    video.addEventListener('canplay', () => {
        controls_location.children[2].innerText = formatDuration(video.duration)
    })
    video.addEventListener('click', switchVideoPlayStatus)
    video.addEventListener('play', () => {
        video_area.classList.remove('paused')
        controls_play.setAttribute('src', '/statics/images/video/controls-pause.svg')
    })
    video.addEventListener('pause', () => {
        video_area.classList.add('paused')
        controls_play.setAttribute('src', '/statics/images/video/controls-play.svg')
    })
    video.addEventListener('timeupdate', () => {
        const ratio = video.currentTime / video.duration
        controls_process_played.style.width = ratio * controls_process.offsetWidth + 'px'
        controls_location.children[0].innerText = formatDuration(video.currentTime)
        controls_process_icon.style.left = ratio * controls_process.offsetWidth - 11 + 'px' // ratio * 778 - (22/2) + 'px'
    })
    video.addEventListener('enterpictureinpicture', () => controls_pip.title = '关闭画中画')
    video.addEventListener('leavepictureinpicture', () => controls_pip.title = '开启画中画')
    controls_play.addEventListener('click', switchVideoPlayStatus)
    danmaku_switch.addEventListener('click', switchDanmakuStatus)
    danmaku_font_switch.addEventListener('mouseover', () => danmaku_font_settings.style.display = 'block')
    danmaku_font_switch.addEventListener('mouseout', () => danmaku_font_settings.style.display = 'none')
    danmaku_font_settings.addEventListener('mouseover', () => danmaku_font_settings.style.display = 'block')
    danmaku_font_settings.addEventListener('mouseout', () => danmaku_font_settings.style.display = 'none')
    danmaku_send.addEventListener('click', () => {
        new Danmaku(danmaku_input.value, color_input.value, chosen_danmaku_type)
    })
    controls_process.addEventListener('click', e => {
        let player_ratio = e.offsetX / controls_process.offsetWidth
        video.currentTime = player_ratio * video.duration
        danmaku_area.innerHTML = ''
    })
    controls_speed.addEventListener('click', switchPlaySpeed)
    controls_mute.addEventListener('click', switchMuteStatus)
    controls_pip.addEventListener('click', switchPIPStatus)
    controls_wide.addEventListener('click', switchWide)
    color_input.addEventListener('input', () => {
        color_input.value = color_input.value.toUpperCase()
        color_preview.style.backgroundColo = checkHex(color_input.value) ? color_input.value : 'rgba(0,0,0,0)';
    })
    for (let i in danmaku_type)
        danmaku_type[i].addEventListener('click', () => changeDanmakuType(i));
    for (let v of color_list)
        v.addEventListener('click', () => changeDanmakuColor(v.style.backgroundColor));
}
function test() {
    let recommend_data = [
        {
            cover: '/statics/test/rcmd7.webp',
            title: '【8848】跌跟头手机',
            author: '古月浪子',
            play_number: '162',
            danmaku_number: '10',
        }, {
            cover: '/statics/test/rcmd2.webp',
            title: '[CS:GO]经典差点干掉队友拿五杀',
            author: 'ほしの雲しょう',
            play_number: '6',
            danmaku_number: '0',
        }, {
            cover: '/statics/test/rcmd3.webp',
            title: 'CSS进阶',
            author: 'kying-star',
            play_number: '789',
            danmaku_number: '2',
        }, {
            cover: '/statics/test/rcmd4.webp',
            title: 'Web后端第四节课-go杂谈&常用包',
            author: 'sarail',
            play_number: '48',
            danmaku_number: '0',
        }, {
            cover: '/statics/test/rcmd5.png',
            title: '我是#鹿乃#的NO.008757号真爱粉，靓号在手，走路带风，解锁专属粉丝卡片，使用专属粉丝装扮，你也来生成你的专属秀起来吧！',
            author: '辇道增柒',
            play_number: '40',
            danmaku_number: '0',
        }, {
            cover: '/statics/test/rcmd6.webp',
            title: '打爆灯塔！快乐的Sword Art Online: Fatal Bullet',
            author: 'ほしの雲しょう',
            play_number: '74',
            danmaku_number: '0',
        }, {
            cover: '/statics/test/rcmd1.webp',
            title: 'Dota2主播日记226期：翔哥NB，zardNB，肚皇NB（都破音）',
            author: '抽卡素材库',
            play_number: '4183',
            danmaku_number: '29',
        }, {
            cover: '/statics/test/rcmd8.webp',
            title: '【原神钢琴】晚安，璃月 | Good Night, Liyue',
            author: 'jerritaaa',
            play_number: '33',
            danmaku_number: '0',
        }
    ]
    let danmaku_data = [{
        "id": 1,
        "video_id": 1,
        "user_id": 1,
        "value": "第一",
        "color": "FFFFFF",
        "type": "scroll",
        "time": "1970/1/1 00:00:00",
        "location": 0,
    }, {
        "id": 2,
        "video_id": 1,
        "user_id": 1,
        "value": "第二",
        "color": "FF0000",
        "type": "scroll",
        "time": "1970/1/1 00:00:00",
        "location": 2,
    }, {
        "id": 3,
        "video_id": 1,
        "user_id": 1,
        "value": "第三",
        "color": "000000",
        "type": "scroll",
        "time": "1970/1/1 00:00:00",
        "location": 8,
    }, {
        "id": 4,
        "video_id": 1,
        "user_id": 1,
        "value": "第四",
        "color": "FFFFFF",
        "type": "scroll",
        "time": "1970/1/1 00:00:00",
        "location": 8,
    }, {
        "id": 5,
        "video_id": 1,
        "user_id": 1,
        "value": "第五",
        "color": "FFFFFF",
        "type": "scroll",
        "time": "1970/1/1 00:00:00",
        "location": 8,
    }]

    loadRecommend(recommend_data)
    loadDanmaku(danmaku_data)
}

init()
test()