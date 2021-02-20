const old_account_input = document.querySelector('#old_account>input')
const old_account_hint = document.querySelector('#old_account>p')
const old_code_input = document.querySelector('#old_code>input')
const old_code_button = document.querySelector('#old_code>button')
const old_code_hint = document.querySelector('#old_code>p')
const new_email_input = document.querySelector('#new_email>input')
const new_email_hint = document.querySelector('#new_email>p')
const new_code_input = document.querySelector('#new_code>input')
const new_code_button = document.querySelector('#new_code>button')
const new_code_hint = document.querySelector('#new_code>p')
const submit_button = document.querySelector('#submit>button')

function checkOldAccount() {
    if (old_account_input.value === '') {
        old_account_hint.textContent = '账号不可为空'
        return false
    } else if (old_account_input.value.match(/^\d+$/)) {
        old_account_hint.textContent = ''
        return 'phone'
    } else if (old_account_input.value.match(/^\w+(\.\w+)*@\w+(\.\w+)+$/)) {
        old_account_hint.textContent = ''
        return 'email'
    } else {
        old_account_hint.textContent = '账号格式无效'
        return false
    }
}
function checkOldCode() {
    if (old_code_input.value === '') {
        old_code_hint.textContent = '验证码不可为空'
        return false
    } else if (old_code_input.value.match(/^\d{6}$/)) {
        old_code_hint.textContent = ''
        return true
    } else {
        old_code_hint.textContent = '验证码格式无效'
        return false
    }
}
function checkNewEmail() {
    if (new_email_input.value === '') {
        new_email_hint.textContent = '新邮箱不可为空'
        return false
    } else if (new_email_input.value.match(/^\w+(\.\w+)*@\w+(\.\w+)+$/)) {
        new_email_hint.textContent = ''
        return true
    } else {
        new_email_hint.textContent = '新邮箱格式无效'
        return false
    }
}
function checkNewCode() {
    if (new_code_input.value === '') {
        new_code_hint.textContent = '验证码不可为空'
        return false
    } else if (new_code_input.value.match(/^\d{6}$/)) {
        new_code_hint.textContent = ''
        return true
    } else {
        new_code_hint.textContent = '验证码格式无效'
        return false
    }
}

old_code_button.onclick = function () {
    const type = checkOldAccount()
    if (type === 'email' || type === 'phone') {
        old_code_button.setAttribute('disabled', 'disabled')
        old_code_button.textContent = '获取中...'
        const url = 'https://anonym.ink/api/verify/' + (type === 'email' ? 'email' : 'sms/general')
        const bodyJson = type === 'email' ? {
            email: old_account_input.value
        } : {
            phone: old_account_input.value
        }
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery(bodyJson)
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    old_code_button.textContent = '已获取'
                } else {
                    alert('验证码发送失败：' + json.data)
                    old_code_button.removeAttribute('disabled')
                    old_code_button.textContent = '点击获取'
                }
            })
    } else {
        console.log('账号格式无效')
    }
}
new_code_button.onclick = function () {
    if (checkNewEmail()) {
        new_code_button.setAttribute('disabled', 'disabled')
        new_code_button.textContent = '获取中...'
        fetch('https://anonym.ink/api/verify/email', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery({
                email: new_email_input.value
            })
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    new_code_button.textContent = '已获取'
                } else {
                    alert('验证码发送失败：' + json.data)
                    new_code_button.removeAttribute('disabled')
                    new_code_button.textContent = '点击获取'
                }
            })
    } else {
        console.log('新邮箱格式无效')
    }
}
submit_button.onclick = function () {
    let ok = true
    if (!checkOldAccount()) ok = false
    if (!checkOldCode()) ok = false
    if (!checkNewEmail()) ok = false
    if (!checkNewCode()) ok = false
    if (!ok) return;
    submit_button.setAttribute('disabled', 'disabled')
    submit_button.textContent = '提交中...'
    fetch('https://anonym.ink/api/user/email', {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: jsonToQuery({
            old_account: old_account_input.value,
            old_code: old_code_input.value,
            new_email: new_email_input.value,
            new_code: new_code_input.value,
            token: user.token
        })
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                alert('修改成功')
                window.location.href = '/account/setting'
            } else {
                alert('提交失败：' + json.data)
                submit_button.removeAttribute('disabled')
                submit_button.textContent = '提交'
            }
        })
}

old_account_input.oninput = checkOldAccount
old_code_input.oninput = checkOldCode
new_email_input.oninput = checkNewEmail
new_code_input.oninput = checkNewCode