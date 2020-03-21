<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">42Video</div>
                <el-dropdown class="userInfo" @command="commandHandler">
                    <span class="el-dropdown-link">
                        {{user.name}}<i><img
                            src="https://www.zehnnanne.com/1354413904212CEA558B751E5436F492E1142D92B2.jpg" alt=""></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router>
                        <!-- router:饿了吗ui自带功能，可以使用router代替自定义的页面跳转事件，router会自动扫描index作为url-->
                        <div v-for="(item,index) in this.$router.options.routes" v-if="!item.hidden" :key="index">
                            <el-menu-item :index="children.path" v-for="(children,indexj) in item.children">
                                <span slot="title" :key="indexj">{{item.name}}</span>
                            </el-menu-item>
                        </div>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div style="text-align: center" v-if="this.$router.currentRoute.path=='/home'">
                        42Video后台管理
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        methods: {
            commandHandler(cmd) {
                this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getRequest("/logout");
                    window.sessionStorage.removeItem("user")
                    this.$router.replace("/")
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
        }
    }
</script>
<style>
    .homeRouterView{
        margin-top:10px;
    }
    .homeHeader {
        background-color: deepskyblue;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: Futura;
        color: white;
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
</style>