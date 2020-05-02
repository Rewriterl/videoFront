<template>
    <div>
        <div>
            <el-button type="primary" @click="dialogFormVisible = true">上传视频</el-button>
            <el-input
                    size="small"
                    placeholder="请输入标签信息..."
                    prefix-icon="el-icon=search"
                    style="width: 300px;margin-left: 30px"
                    v-model="keyword"
                    @keydown.enter.native="initTable()">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" plain @click="initTable()">查询</el-button>
        </div>
        <div>
            <el-row :gutter="25">
                <el-col v-for="(o, index) in tableData.length" :key="o" :offset="2"
                        style="width: 200px">
                    <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 5px">
                        <img :src="tableData[index].pic_url"
                             class="image">
                        <div style="padding: 12px;">
                            <span>{{ tableData[index].title }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ 2020 }}</time>
                                <el-button-group>
                                    <el-button type="primary" size="small" icon="el-icon-edit"
                                               @click="showEditView(index)">编辑
                                    </el-button>
                                    <el-button type="danger" size="small" icon="el-icon-delete"
                                               @click="handleDelete(tableData[index].id)">删除
                                    </el-button>
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
                        :page-sizes=[12]
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
                                <el-checkbox-button v-for="tag in tags" :label="tag.id" :key="tags.id">{{tag.name}}
                                </el-checkbox-button>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            drag
                            accept=".avi,.mp4"
                            name="video_file"
                            style="margin-left: 120px"
                            :before-upload="beforeVideoUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :limit="1"
                            :data="form"
                            :action="uploadUrl"
                            :on-preview="vhandlePreview"
                            :on-remove="vhandleRemove"
                            :file-list="uploadVideoList"
                            :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>选择文件</em></div>
                        <div slot="tip" class="el-upload__tip">只能上传mp4/avi文件</div>
                    </el-upload>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addVideo">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog
                    title="视频详情"
                    :visible.sync="dialogVideoInfoVisible"
                    width="30%">
                <div>审核状态</div>
                <el-tooltip :content="'Switch value: ' + value" placement="top">
                    <el-switch
                            v-model="value"
                            active-color="#13ce66"
                            inactive-color="#d3d3d3"
                            active-text="正常"
                            inactive-text="禁用"
                            active-value="1"
                            inactive-value="0">
                    </el-switch>
                </el-tooltip>
                <el-input v-model="form.name" :placeholder="videoViewObj.title"></el-input>
                <div style="margin-top: 20px">
                    <el-checkbox-group v-model="editTagCheckBoxGroup" size="small">
                        <el-checkbox-button v-for="tag in videoViewObj.tags" :label="tag" :key="tag">{{tag}}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </div>
                <el-input
                        type="textarea"
                        autosize
                        :rows="2"
                        :placeholder="videoViewObj.info"
                        v-model="form.textarea">
                </el-input>
                <div>修改视频封面---点击放大</div>
                <div class="demo-image__preview">
                    <el-image
                            style="width: 100%; height: 100%"
                            :src="this.videoViewObj.pic_url"
                            :preview-src-list="picList">
                    </el-image>
                </div>
                <div>
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            drag
                            accept=".png,.jpg"
                            name="pic_file"
                            style="margin-left: 120px"
                            :before-upload="beforePicUpload"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :limit="1"
                            :data="form"
                            :action="uploadPicUrl"
                            :on-preview="vhandlePreview"
                            :on-remove="vhandleRemove"
                            :file-list="uploadPicList"
                            :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>选择文件</em></div>
                        <div slot="tip" class="el-upload__tip">只能上传png/jpg文件</div>
                    </el-upload>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVideoInfoVisible = false">取 消</el-button>
                    <el-button type="primary" @click="doUpdate">确 定</el-button>
                </span>
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
                dialogVideoInfoVisible: false,
                videoViewObj: {}, // 用户修改展示的数据,内部属性:id,title,info,length,tags,play_num,video_url,pic_url
                editTagCheckBoxGroup: [],
                uploadUrl: '/api/addVideo',
                uploadPicUrl: '/api/updateVideo',
                fileList: [],
                uploadVideoList: [], // 自定义的数组，用于处理用于上传视频的fileList，fileList是只读的
                uploadPicList: [],    // 自定义的数组，用于处理用于上传图片的fileList
                tags: [],
                form: {         // 上传文件时附带的表单数据，每次上传完成后清空内部属性值
                    name: '',
                    checkboxGroup: [],
                    textarea: '',
                },
                formLabelWidth: '120px',
                total: 0,
                page: 1,
                size: 12,
                keyword: '',
                value: 1,        // 这是一个测试值，实际应用放在videoViewObj
                picList: []      // 用于图片预览
            }
        },
        mounted() {
            this.initTable();
            this.initTags();
        },
        watch: {
            total() {
                if (this.total === (this.page - 1) * this.size && this.total !== 0) {
                    this.page -= 1;
                    this.initTable();
                }
            }
        },
        methods: {
            initTable() {
                // 查询。初始化视频列表
                this.loading = true
                console.log(this.fileList.length)
                console.log(this.form)
                this.getRequest("/showvideo?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword).then(resp => {
                    if (resp) {
                        this.loading = false
                        this.tableData = resp.data;
                        this.total = resp.total;
                    }
                });
            },
            initTags() {
                // 初始化标签列表
                this.getRequest("/getAllTagNames").then(resp => {
                    if (resp) {
                        this.tags = resp.data;
                    }
                });
            },
            beforeVideoUpload(file) {
                // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
                this.fileList = this.uploadVideoList;
            },
            beforePicUpload(file) {
                // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
                this.fileList = this.uploadPicList;
            },
            onSuccess(response, file, fileList) {
                // 文件上传成功时的钩子
                this.$message({message: response.message, type: 'success'});
                this.$refs.upload.clearFiles();
                this.form.name='';
                this.form.textarea='';
                this.initTable();
            },
            onError(err, file, fileList) {
                // 文件上传失败时的钩子
                this.$message.error(err.message);
            },
            vhandleRemove(file, fileList) {
                // 文件列表移除文件时的钩子
                console.log(file, fileList);
            },
            vhandlePreview(file) {
                // 点击文件列表中已上传的文件时的钩子
                console.log(file);
            },
            handleDelete(data) {
                // 根据id删除文件
                this.$confirm('此操作将永久删除视频【' + data.title + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/delvideo', {vid: data}).then(resp => {
                        if (resp) {
                            this.initTable();
                        } else {
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addVideo(response, file, fileList) {
                // 视频上传(文件+描述)
                this.$refs.upload.submit();
                this.form.checkboxGroup = [];
                this.form.textarea = "";
                this.form.name = "";
                this.dialogFormVisible = false
            },
            showEditView(index) {
                // 展示编辑视频菜单
                this.videoViewObj = Object.assign({}, this.tableData[index])
                this.dialogVideoInfoVisible = true;
                this.editTagCheckBoxGroup = this.videoViewObj.tags;
                this.picList = [];
                this.picList.push(this.videoViewObj.pic_url)
                console.log('showEditView')
            },
            doUpdate() {
                // 执行更新
                this.$refs.upload.submit();
                this.dialogVideoInfoVisible = false;
            },
            currentChange(currentPage) {
                // 当前页改变时会触发的事件
                this.page = currentPage;
                this.initTable();
            },
            sizeChange(currentSize) {
                // 当前页面最大条数改变时会触发的事件
                this.size = currentSize;
                this.initTable();
            },
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