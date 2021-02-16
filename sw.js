console.log('注册成功')

self.addEventListener('install', () => {
    console.log('安装成功')
})

self.addEventListener('activate', () => {
    console.log('激活成功')
})

//self.addEventListener('fetch', event => {})