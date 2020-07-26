import axios from 'axios';
import Auth from '@/util/auth'
import store from '../store'

var CancelToken = axios.CancelToken;
var requestList = [];
var getTokenLock = false;
/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * @description 校验Token是否过期，如果Token过期则根据配置采用不同方法获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 *              跳转授权Token：过期时中断当前所有请求并跳转到对应页面获取Token。注意：跳转页面授权最佳实现应在授权页面点击触发
 */
function checkToken(cancel, callback){
    if(!Auth.hasToken()){
        // 自动获取Token策略
        if(Auth.tokenTimeoutMethod == "getNewToken"){
            // 如果当前有请求正在获取Token
            if(getTokenLock){
                setTimeout(function(){
                    checkToken(cancel, callback)
                }, 500)
            } else {
                getTokenLock = true
                // vuex异步存储
                store.dispatch("auth/getNewToken").then(() => {
                    console.log("已获取新token")
                    callback()
                    getTokenLock = false
                })
            }
        }
        // 跳转授权Token
        if(Auth.tokenTimeoutMethod == "jumpAuthPage" && Auth.isLogin()){
            if(router.currentRoute.path != '/auth'){
                // BUG: 无法保证一定会中断所有请求
                cancel()
                router.push('/auth')
            }
        }
    } else {
        callback()
    }
}

const service = axios.create({
    baseURL: '/',
    timeout: 5000
})

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
function stopRepeatRequest(url, c){
    for( let i = 0; i < requestList.length; i++){
        if(requestList[i] == url){
            c()
            return
        }
    }
    requestList.push(url)
}

// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
    config => {
        console.log("请求拦截")
        console.log(config)
        if(config.url === '/login'){
            return config;
        }
        let cancel;
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        })
        // Token校验
        checkToken(cancel, function(){
            Auth.setLoginStatus()
            // 请求头加入token
            config.headers.Authorization = `${store.state.user.token}`
        })
        // 阻止短时间内的重复请求
        stopRepeatRequest(config.url, cancel)
        return config;
    },
    error =>{
        console.log(error);
        return Promise.reject();
    }
)

// http response 拦截器
service.interceptors.response.use(
    response => {
        console.log("响应拦截")
       for( let i = 0; i < requestList.length; i++){
            if(requestList[i] == response.config.url){
                // 注意，不能保证500ms必定执行，详情请了解JS的异步机制
                setTimeout(function(){
                    requestList.splice(i,1)
                }, 500)
                break
            }
        }
        return Promise.resolve(response.data)
    },
    error => {
        if(axios.isCancel(error)){
            console.log(error)
            return Promise.reject("Ajax Abort: 该请求在axios拦截器中被中断")
        } else if (error.response) {
            // 跳转错误页面
            switch (error.response.status) {
                case 401:
                    router.push('error/401');
                case 403:
                    router.push('error/403');
                default:
                    Message({
                        message: `服务器错误！错误代码：${error.response.status}`,
                        type: 'error'
                    })
            }
            return Promise.reject(error.response.data)
        }
    }
);

export default service;
