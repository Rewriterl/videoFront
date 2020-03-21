<template>
    <div>
        <div>
            <el-button type="primary" @click="dialogFormVisible = true">上传视频</el-button>
        </div>
        <div>
            <el-row>
                <el-col :span="8" v-for="(o, index) in tableData.length" :key="o" :offset="index > 0 ? 1 : 1"
                        style="width: 200px">
                    <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 5px">
                        <img :src="tableData[index].pic_url"
                             class="image">
                        <div style="padding: 14px;">
                            <span>{{ tableData[index].title }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ 2020 }}</time>
                                <el-button-group>
                                    <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
                                    <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
                                </el-button-group>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div style="display: flex;justify-content: flex-start">
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div>
            <el-dialog title="上传视频" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="视频名" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" placeholder="请输入视频名"></el-input>
                    </el-form-item>
                    <el-form-item label="视频描述" :label-width="formLabelWidth">
                        <el-input
                                type="textarea"
                                autosize
                                :rows="2"
                                placeholder="请输入视频描述"
                                v-model="form.textarea">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="视频标签" :label-width="formLabelWidth">
                        <div style="margin-top: 20px">
                            <el-checkbox-group v-model="form.checkboxGroup" size="medium">
                                <el-checkbox-button v-for="tag in tags" :label="tag" :key="tag">{{tag}}
                                </el-checkbox-button>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Video",
        data() {
            return {
                tableData: [],
                dialogFormVisible: false,
                tags: [1, 2, 3, 4, 5],
                form: {
                    name: '',
                    delivery: false,
                    checkboxGroup:[],
                    resource: '',
                    desc: '',
                    textarea: '',
                },
                formLabelWidth: '120px',
                total:0,
                page: 1,
                size: 18,
            }
        },
        mounted() {
            this.initTable();
        },
        methods: {
            initTable() {
                // this.loading = true
                this.getRequest("/showvideo?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword).then(resp => {
                    if (resp) {
                        // this.loading = false
                        this.tableData = resp.data;
                        this.total = resp.data[0].total;
                    }
                })
            },
            currentChange(currentPage) {
                this.page = currentPage;
                this.initTable();
            },
            sizeChange(currentSize) {
                this.size = currentSize;
                this.initTable();
            }
        }
    }
</script>

<style>
    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>