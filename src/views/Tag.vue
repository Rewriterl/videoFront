<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="addTagInput"
                    style="width: 300px"
                    placeholder="添加标签"
                    prefix-icon="el-icon-search"
                    @keydown.enter.native="addTag"
                    v-model="addTagObj.tagname">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" plain @click="addTag">添加</el-button>
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
        <div class="tableMain">
            <el-table
                    size="small"
                    :data="tableData"
                    border
                    stripe
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    @selection-change="handleSelectionChange">
                style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="tag_id"
                        label="标签id"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="tag_name"
                        label="标签名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="add_time"
                        width="260"
                        label="添加时间">
                </el-table-column>
                <el-table-column width="300" label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--    此处:disabled为v-model的缩写        -->
            <div style="display: flex;justify-content: flex-start">
                <el-pagination
                        background
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
            <el-button @click="deleteTags" type="danger" style="margin-top:8px" :disabled="multipleSelection.length===0">
                批量删除
            </el-button>
        </div>
        <el-dialog
                title="修改标签"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-tag>标签名</el-tag>
                <el-input class="updateTableInput" v-model="tagViewObj.tag_name"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Tag",
        data() {
            return {
                addTagObj: {
                    tagname: ''
                },
                tableData: [],
                dialogVisible: false,
                tagViewObj: {
                    tag_name: ''
                },
                multipleSelection: [],
                total: 0,
                page: 1,
                size: 10,
                loading: false,
                keyword: '',
            }
        },
        mounted() {
            this.initTable();
        },
        watch: {
            total(){
                if (this.total === (this.page-1)*this.size && this.total!== 0){
                    this.page-=1;
                    this.initTable();
                }
            }
        },
        methods: {
            initTable() {
                this.loading = true
                this.getRequest("/showtag?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword).then(resp => {
                    if (resp) {
                        this.loading = false
                        this.tableData = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            showEditView(index, data) {
                // 对象属性拷贝，这样能避免在未执行修改时数据发生变化
                Object.assign(this.tagViewObj, data)
                this.dialogVisible = true;
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除标签【' + data.tag_name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.postRequest('/deltag', data).then(resp => {
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
            deleteTags() {
                this.$confirm('此操作将永久删除标签【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tags = []
                    this.multipleSelection.forEach(item => {
                        tags.push(item.tag_id)
                        console.log(tags)
                    })
                    this.postRequest('/delTags', {"tags": tags}).then(resp => {
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
            addTag() {
                if (this.addTagObj.tagname) {
                    this.postRequest('/addTag', this.addTagObj).then(resp => {
                        if (resp) {
                            this.initTable();
                            this.addTagObj.tagname = ''
                        }
                    })
                } else {
                    this.$message.error('标签名不能为空');
                }
            },
            doUpdate() {
                this.postRequest('/editTag', this.tagViewObj).then(resp => {
                    if (resp) {
                        this.initTable();
                        this.tagViewObj.tag_name = '';
                        this.dialogVisible = false;
                    } else {

                    }
                })
            },
            // 回调：已选中的数组
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
    .addTagInput {
        width: 300px;
    }

    .updateTableInput {
        width: 200px;
        margin-left: 8px;
    }

    .tableMain {
        margin-top: 10px;
    }
</style>