let user = {
    id: 1,
    username: 'admin',
    token: '1000000000'
}

export default {
    'post|/login': option => {
        let data = JSON.parse(option.body)
        if(data.username === 'admin' && data.password === 'admin'){
            return {
                code: 10000,
                msg: '登录成功',
                data: user
            };
        }else{
            return {
                code: 30001,
                msg: '登录失败'
            };
        }

    }
}
