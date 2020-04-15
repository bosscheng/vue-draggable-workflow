<template>
  <div>
    <template v-for="flowItem in flowAllList">
      <div class="items-box">
        <template v-for="(item,index) in flowItem.children">
          <template v-if="flowItem.type === flowTypeConstant.action">
            <div class="node" @click="handleClick(item)" v-if="!item.hidden">
              <div class="step-img" :class="item.className"></div>
              <div class="step-title">{{item.name}}</div>
            </div>
          </template>
          <template v-else-if="flowItem.type === flowTypeConstant.flow">
            <div class="node node-circle" @click="handleClick(item)" v-if="!item.hidden">
              <div class="step-img" :class="item.className"></div>
            </div>
          </template>
          <template v-else-if="flowItem.type === flowTypeConstant.condition">
            <div class="node-square" @click="handleClick(item)" v-if="!item.hidden">
              <div class="square">
                <div class="step-img" :class="item.className"></div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  import {FLOW_ALL_LIST, FLOW_TYPE} from "../constant";

  export default {
    name: "ListForm",
    data() {
      return {
        flowAllList: FLOW_ALL_LIST,
        flowTypeConstant: FLOW_TYPE,

      }
    },
    methods: {
      handleClick(flowItem) {
        this.$emit('handleCheck', flowItem);
      }
    }
  }
</script>

<style lang="scss" scoped>

  .items-box {
    border: 1px solid #eee;
    border-radius: 4px;

    margin-bottom: 5px;
    padding-top: 15px;

    &:last-child {
      margin-bottom: 0;
    }


    .node-square {
      margin-bottom: 15px;
    }
  }
</style>
