<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="tempItem" label-width="80px">
            <el-form-item label="名称" prop="stepName">
                <el-input size="small" v-model="tempItem.stepName" style="width: 200px"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import {clone} from "@/utils";

    function _getTempItem() {
        return {
            stepName: '新建',
        }
    }

    export default {
        name: "StartNodeForm",
        props: {
            editItem: {
                type: Object,
            }
        },
        data() {
            return {
                tempItem: _getTempItem(),
                rules: {
                    stepName: [{required: true, trigger: 'blur', message: '请填写名称'}],
                }
            }
        },
        created() {
            if (this.editItem && this.editItem.stepName) {
                this.tempItem = clone(this.editItem);
            }
        },

        methods: {
            //
            validateFormData() {
                return new Promise((resolve, reject) => {

                    this.$refs['dataForm'].validate((valid) => {
                        if (!valid) {
                            reject();
                            return;
                        }
                        resolve();
                    })
                });
            },

            formData() {
                let tempItem = clone(this.tempItem);
                return tempItem
            }
        }
    }
</script>

<style scoped>

</style>
