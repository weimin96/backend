import Cookies from 'js-cookie'
import axios from '@/util/axios'
import Auth from '@/util/auth'

const state = {
    token: ''
}

// 这里的方法必须同步执行
const mutations = {
    setToken: (state, data) => {
        if(data){
            Auth.setToken(data)
            Auth.setLoginStatus()
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data
    }
}

// 这里可以进行异步操作
const actions = {
    // 获取新Token （参数解构{}简化代码，直接获取commit）
    getNewToken({commit, state}){
        return new Promise((resolve) => {
            axios.get('/getToken',{
                param:{
                    token: state.token
                }
            }).then((res) =>{
                commit("setToken", res.token)
                resolve()
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}