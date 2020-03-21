<template>
    <div>
        <el-form ref="loginForm" :rules="rules" :model="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码" @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-checkbox class="loginRemember" v-model="checked"></el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                checked: true,
                loginForm: {
                    username: 'Neoadmin',
                    password: '42..video'
                },
                rules: {
                    // 规则详情参见官方属性表
                    username: [{required: true, message: "请输入用户名", trigger: "blur"}],
                    password: [{required: true, message: "请输入密码", trigger: "blur"}]
                }
            }
        },
        methods: {
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                        if (valid) {
                            this.doLogin('/doLogin', this.loginForm).then(resp => {
                                if (resp) {
                                    window.sessionStorage.setItem("user",JSON.stringify(resp.data))
                                    this.$router.replace('/home')
                                }
                            })
                        } else {
                            this.$message.error('请输入所有字段')
                            return false
                        }
                    }
                )
            }
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c9;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;

    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>