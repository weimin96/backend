<template>
    <div class="wrapper">
        <template>
            <!-- 标题 -->
            <header-bar v-once>
                <p slot="logo">后台管理系统</p>
            </header-bar>
            <!-- 侧边栏 -->
            <nav-bar></nav-bar>
        </template>
        <div class="sys-content left">
            <!-- 状态栏 -->
            <tag-nav></tag-nav>
            <!-- 主体 缓存-->
            <keep-alive :include="tagNavList">
                <router-view/>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import TagNav from './TagNav'
import NavBar from './NavBar'

export default {
    computed: {
        // 缓存的标签页
        tagNavList(){
            return this.$store.state.tagNav.cachedPageName
        }
    },
    components:{
        HeaderBar,
        TagNav,
        NavBar
    }
}
</script>
