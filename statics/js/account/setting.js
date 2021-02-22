const avatar_label = document.querySelector('#main .avatar label')
const avatar_input = document.querySelector('#main .avatar input')
const avatar_img = document.querySelector('#main .avatar img')
const avatar_reads= new FileReader();
const username_span = document.querySelector('#main span.username')
const username_button = document.querySelector('#main button.username')
const statement_span = document.querySelector('#main span.statement')
const statement_button = document.querySelector('#main button.statement')
const gender_span = document.querySelector('#main span.gender')
const gender_button = document.querySelector('#main button.gender')
const birthday_span = document.querySelector('#main span.birthday')
const birthday_button = document.querySelector('#main button.birthday')
const bonus_checkIn = document.querySelector('#bonus .check-in')
const bonus_dailyView = document.querySelector('#bonus .daily-view')
const bonus_dailyCoin = document.querySelector('#bonus .daily-coin')

async function init() {
    fetch('https://anonym.ink/api/user/daily?token=' + user.token)
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                console.log(json.data)
                if (json.data['check-in']) {
                    bonus_checkIn.classList.add('done')
                    bonus_checkIn.textContent = '已完成'
                } else {
                    bonus_checkIn.classList.add('doing')
                    bonus_checkIn.textContent = '未完成'
                }
                if (json.data['view']) {
                    bonus_dailyView.classList.add('done')
                    bonus_dailyView.textContent = '已完成'
                } else {
                    bonus_dailyView.classList.add('doing')
                    bonus_dailyView.textContent = '未完成'
                }
                if (json.data['coin'] === 50) {
                    bonus_dailyCoin.classList.add('done')
                    bonus_dailyCoin.textContent = '已完成'
                } else {
                    bonus_dailyCoin.classList.add('doing')
                    bonus_dailyCoin.textContent = json.data['coin'] + ' / 50'
                }
            } else {
                console.log("获取日常任务进度失败：", json.data)
            }
        })
    avatar_img.src = user.data.Avatar
    username_span.innerText = user.data.Username
    statement_span.innerText = user.data.Statement
    switch (user.data.Gender) {
        case 'F': gender_span.innerText = '女'; break;
        case 'M': gender_span.innerText = '男'; break;
        case 'O': gender_span.innerText = '其他'; break;
        case 'N': gender_span.innerText = '保密'; break;
    }
    if (user.data.Birthday.substring(0,4) === '9999') {
        birthday_span.innerText = '未填写'
    } else {
        birthday_span.innerText = user.data.Birthday.substring(0, 10)
    }
    username_button.onclick = changeUsername
    statement_button.onclick = changeStatement
    gender_button.onclick = changeGender
    birthday_button.onclick = changeBirthday
    avatar_input.onchange = () => {
        if (avatar_input.files.length === 0) {
            return
        }
        avatar_label.innerText = '上传中...'
        const file = avatar_input.files[0]
        avatar_reads.readAsDataURL(file);
        const form = new FormData();
        form.append("avatar", file);
        form.append("token", user.token);
        fetch('https://anonym.ink/api/user/avatar', {
            method: 'PUT',
            body: form
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    alert("上传成功")
                } else {
                    alert("上传失败：" + json.data)
                }
                avatar_label.innerText = '上传头像'
            })
    }
    avatar_reads.onload = () => {
        avatar_img.src = avatar_reads.result;
    }
}
function changeUsername(){
    const value = prompt('请输入新的昵称')
    if (value === null) return;
    updateInfo('username', value, function(){
        username_span.innerText = value
        uh_username.innerText = value
        user.data.Coins -= 6
        uh_coin.innerText = user.data.Coins
    })
}
function changeStatement(){
    const value = prompt('请输入新的签名')
    if (value === null) return;
    updateInfo('statement', value, function(){
        statement_span.innerText = value
    })
}
function changeGender(){
    let value = prompt('请输入新的性别：男/女/其他/保密')
    if (value === null) return;
    switch (value) {
        case '女': value = 'F'; break;
        case '男': value = 'M'; break;
        case '其他': value = 'O'; break;
        case '保密': value = 'N'; break;
        default: alert('无效的性别'); return
    }
    updateInfo('gender', value, function(){
        switch (value) {
            case 'F': gender_span.innerText = '女'; break;
            case 'M': gender_span.innerText = '男'; break;
            case 'O': gender_span.innerText = '其他'; break;
            case 'N': gender_span.innerText = '保密'; break;
        }
    })
}
function changeBirthday(){
    const value = prompt('请输入新的出生日期，格式：1919-08-10')
    if (value === null) return;
    updateInfo('birth', value, function() {
        if (value === '9999-12-12T00:00:00Z') {
            birthday_span.innerText = '未填写'
        } else {
            birthday_span.innerText = value
        }
    })
}
function updateInfo(type, value, callback){
    let body = {}
    body['token'] = user.token;
    body['new_' + type] = value
    fetch('https://anonym.ink/api/user/' + type, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: jsonToQuery(body)
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                alert('修改成功')
                callback()
            } else {
                alert('修改失败：' + json.data)
            }
        })
}

tokenInit.then(() => init())