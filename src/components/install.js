// 组件全局注册
import Vue from 'vue'


import AppTitle from './AppTitle'
import AppNotes from './AppNotes'
import AppSection from './AppSection'

// 组件库
const Components = [
    AppTitle,
    AppNotes,
    AppSection
]

// 注册全局组件
Components.map((com) =>{
    Vue.component(com.name, com)
})

export default Vue
