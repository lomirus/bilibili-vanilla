const account_input = document.querySelector('#account>input')
const account_hint = document.querySelector('#account>p')
const code_input = document.querySelector('#code>input')
const code_button = document.querySelector('#code>button')
const code_hint = document.querySelector('#code>p')
const newPassword_input = document.querySelector('#new_password>input')
const newPassword_hint = document.querySelector('#new_password>p')
const newPasswordRepeat_input = document.querySelector('#new_password_repeat>input')
const newPasswordRepeat_hint = document.querySelector('#new_password_repeat>p')
const submit_button = document.querySelector('#submit>button')

function checkAccount() {
    if (account_input.value === '') {
        account_hint.textContent = '账号不可为空'
        return false
    } else if (account_input.value.match(/^\d+$/)) {
        account_hint.textContent = ''
        return 'phone'
    } else if (account_input.value.match(/^\w+(\.\w+)*@\w+(\.\w+)+$/)) {
        account_hint.textContent = ''
        return 'email'
    } else {
        account_hint.textContent = '账号格式无效'
        return false
    }
}
function checkCode() {
    if (code_input.value === '') {
        code_hint.textContent = '验证码不可为空'
        return false
    } else if (code_input.value.match(/^\d{6}$/)) {
        code_hint.textContent = ''
        return true
    } else {
        code_hint.textContent = '验证码格式无效'
        return false
    }
}
function checkNewPassword() {
    if (newPassword_input.value.length < 6) {
        newPassword_hint.textContent = '密码不能小于6个字符'
        return false
    } else if (newPassword_input.value.length > 16) {
        newPassword_hint.textContent = '密码不能大于16个字符'
        return false
    } else {
        newPassword_hint.textContent = ''
        return true
    }
}
function checkNewPasswordRepeat() {
    if (newPasswordRepeat_input.value === newPassword_input.value) {
        newPasswordRepeat_hint.textContent = ''
        return true
    } else {
        newPasswordRepeat_hint.textContent = '密码不一致'
        return false
    }
}

code_button.onclick = function () {
    const type = checkAccount()
    if (type === 'email') {
        code_button.setAttribute('disabled', 'disabled')
        code_button.textContent = '获取中...'
        fetch('https://anonym.ink/api/verify/email', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery({
                email: account_input.value
            })
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    code_button.textContent = '已获取'
                } else {
                    alert('验证码发送失败：' + json.data)
                    code_button.removeAttribute('disabled')
                    code_button.textContent = '点击获取'
                }
            })
    } else if (type === 'phone') {
        code_button.setAttribute('disabled', 'disabled')
        code_button.textContent = '获取中...'
        fetch('https://anonym.ink/api/verify/sms/general', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            },
            body: jsonToQuery({
                phone: account_input.value
            })
        })
            .then(data => data.json())
            .then(json => {
                if (json.status) {
                    code_button.textContent = '已获取'
                } else {
                    alert('验证码发送失败：' + json.data)
                    code_button.removeAttribute('disabled')
                    code_button.textContent = '点击获取'
                }
            })
    } else {
        console.log('账号格式无效')
    }
}
submit_button.onclick = function () {
    let ok = true
    if (!checkAccount()) ok = false
    if (!checkCode()) ok = false
    if (!checkNewPassword()) ok = false
    if (!checkNewPasswordRepeat()) ok = false
    if (!ok) return;
    submit_button.setAttribute('disabled', 'disabled')
    submit_button.textContent = '提交中...'
    fetch('https://anonym.ink/api/user/password', {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: jsonToQuery({
            account: account_input.value,
            code: code_input.value,
            new_password: newPassword_input.value
        })
    })
        .then(data => data.json())
        .then(json => {
            if (json.status) {
                alert('修改成功')
                window.location.href = user.token === '' ? '/account/login' : '/'
            } else {
                alert('提交失败：' + json.data)
                submit_button.removeAttribute('disabled')
                submit_button.textContent = '提交'
            }
        })
}

account_input.oninput = checkAccount
code_input.oninput = checkCode
newPassword_input.oninput = checkNewPassword
newPasswordRepeat_input.oninput = checkNewPasswordRepeat