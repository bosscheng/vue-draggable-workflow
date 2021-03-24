<template>
    <div class="flow-layout">
        <div class="flow-editor">
            <div class="flow-tools">
                <el-tooltip class="item" effect="dark" content="自动排列" placement="top-start">
                    <div class="tool-item" title="" @click="handleSort">
                        <span class="icon-duiqi"></span>
                    </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="清空" placement="top-start">
                    <div class="tool-item" @click="handleClear">
                        <span class="icon-clear"></span>
                    </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="获取JSON数据" placement="top-start">
                    <div class="tool-item" @click="handleGetData">
                        <span class="icon-json"></span>
                    </div>
                </el-tooltip>
            </div>
            <!--zoom-->
            <div class="flow-zoom" :data-zoom="canvasDataRoom + '%'">
                <div class="zoom-btn">
                    <el-button size="mini" :class="{'el-button--primary':canvasRoomMinusEnable}" icon="el-icon-minus"
                               circle
                               @click="handleMinusCanvas"></el-button>
                </div>
                <div class="zoom-btn">
                    <el-button size="mini" :class="{'el-button--primary':canvasRoomPlusEnable}" icon="el-icon-plus"
                               circle
                               @click="handlePlusCanvas"></el-button>
                </div>
            </div>
            <!--    canvas   -->
            <div class="canvas-container" :data-zoom="canvasDataRoom">
                <div id="campaignCanvas" :style="canvasRoomScaleStyle" ref="campaignCanvas">
                    <template v-for="(flowItem,index) in flowList">
                        <div class="node-content-wrap"
                             :key="index"
                             @mousedown="handleFlowMoveDown"
                             @mouseup="(event)=>{handleChangeFlowPosition(flowItem,event)}"
                             :id="flowItem.uuid"
                             @click.stop="(event)=>{handleEditFlowItem(flowItem,event)}"
                             :style="{left:flowItem.left+'px',top:flowItem.top+'px'}">
                            <div class="node-content">
                                <draggable class="node-temp-small" :ref="flowItem.uuid"
                                           :group="{name:'sortable', pull:false, put: true }">
                                </draggable>
                                <template v-if="flowItem.groupType === flowTypeConstant.action">
                                    <div class="flow-item node">
                                        <div class="step-img" :class="flowItem.className"></div>
                                        <div class="step-title">{{flowItem.name}}</div>
                                    </div>
                                    <!--flow text-->
                                    <div class="flow-text">
                                        <div class="text-line">
                                            <span>{{flowItem.formData && flowItem.formData.stepName}}</span>
                                            <i class="el-icon-close flow-delete"
                                               @click.stop="handleDeleteFlowItem(flowItem)"></i>
                                        </div>
                                    </div>
                                    <!--    -->
                                </template>
                                <template v-else-if="flowItem.groupType === flowTypeConstant.condition">
                                    <div class="flow-item node-square">
                                        <div class="square">
                                            <div class="step-img" :class="flowItem.className"></div>
                                        </div>
                                    </div>
                                    <div class="flow-text">
                                        <div class="text-line">
                                            <span>{{flowItem.formData && flowItem.formData.stepName}}</span>
                                            <i class="el-icon-close flow-delete"
                                               @click.stop="handleDeleteFlowItem(flowItem)"></i>
                                        </div>
                                        <div class="text-line1">
                                            <template v-if="flowItem.formData && flowItem.formData.ifNodeTitle">
                                                <span class="text-content">{{flowItem.formData.ifNodeTitle}}</span>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                                <!-- flow -->
                                <template v-else-if="flowItem.groupType === flowTypeConstant.flow">
                                    <div class="flow-item node node-circle">
                                        <div class="step-img" :class="flowItem.className"></div>
                                    </div>
                                    <div class="flow-text">
                                        <div class="text-line">
                                            <span>{{flowItem.formData && flowItem.formData.stepName}}</span>
                                            <i class="el-icon-close flow-delete"
                                               v-if="flowItem.type !== flowItemTypeConstant.startNode"
                                               @click.stop="handleDeleteFlowItem(flowItem)"></i>
                                        </div>
                                    </div>
                                </template>
                                <!--  temp node -->
                                <template v-if="flowItem.groupType === flowTypeConstant.temp ">
                                    <draggable class="flow-item node-temp node-temp-img"
                                               ref="tempNode"
                                               :id="flowItem.uuid"
                                               :group="{name:'sortable', pull:false, put: true }">
                                    </draggable>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- sidebar-->
            <div class="flow-editor-sidebar">
                <template v-for="(flowItem,index) in flowAllList">
                    <draggable class="items-box"
                               :key="index"
                               :list="flowItem.children"
                               :group="{name:'sortable', pull: 'clone', put: false }"
                               v-bind="dragConfig"
                               :move="handleFlowMoveItem"
                               @start="handleFlowMoveStart"
                               @end="handleFlowMoveEnd"
                               :sort="false"
                               :ref="flowItem.ref">
                        <template v-for="(item,index) in flowItem.children">
                            <template v-if="flowItem.type === flowTypeConstant.action">
                                <div class="node" :key="index" :title="item.name" :data-id="item.id"
                                     :data-type="item.type"
                                     :data-group="item.groupType"
                                     v-if="!item.hidden">
                                    <div class="step-img" :class="item.className"></div>
                                    <div class="step-title">{{item.name}}</div>
                                </div>
                            </template>
                            <template v-else-if="flowItem.type === flowTypeConstant.flow">
                                <div class="node node-circle" :key="index" :title="item.name" :data-id="item.id"
                                     :data-type="item.type"
                                     :data-group="item.groupType"
                                     v-if="!item.hidden">
                                    <div class="step-img" :class="item.className"></div>
                                </div>
                            </template>
                            <template v-else-if="flowItem.type === flowTypeConstant.condition">
                                <div class="node-square" :key="index" :title="item.name" :data-id="item.id"
                                     :data-type="item.type"
                                     :data-group="item.groupType"
                                     v-if="!item.hidden">
                                    <div class="square">
                                        <div class="step-img" :class="item.className"></div>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </draggable>
                </template>
            </div>
        </div>
        <el-dialog
                class="dialog-wrap"
                :visible.sync="dialogObj.visible"
                :show-close=false
                width="500px">
            <template v-if="dialogObj.editType === flowItemTypeConstant.list">
                <list-form @handleCheck="handleSelectFlowItem"></list-form>
            </template>
            <template v-else>
                <div slot="title" class="dialog-title">
                    <i class="el-icon-arrow-left" v-if="dialogObj.editType !== flowItemTypeConstant.startNode"
                       @click="handleGoList"></i>
                    <span class="desc">{{dialogObj.editType}}</span>
                </div>
                <div class="dialog-body">
                    <template v-if="dialogObj.editType">
                        <component v-bind:is="dialogFlowItemComponent" ref="flowEditComponent"
                                   :editItem.sync="dialogObj.editForm"></component>
                    </template>
                </div>
            </template>
            <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog" size="mini">取 消</el-button>
        <el-button type="primary" @click="handleTempFlowFormData" size="mini"
                   v-if="dialogObj.editType !== flowItemTypeConstant.list">确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog
                title="JSON数据"
                :visible.sync="dialogVisible"
                width="700px">
            <div class="pre-show" ref="preShow" v-if="dialogVisible"></div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import JSONFormatter from 'json-formatter-js';
    import Draggable from './Draggable';
    import {FLOW_ITEM_TYPE, FLOW_ALL_LIST, FLOW_LIST, FLOW_TYPE} from "../constant";
    import {clone, uuid} from "../utils";
    import {addClass, removeClass, getWidth} from '../utils/dom';
    import ListForm from './listForm';
    import StartNodeForm from './startNodeForm';
    import NodeNodeForm from './nodeNodeForm';
    import IfNodeForm from './ifNodeForm';
    import ExpandNodeForm from './expandNodeForm'

    import {jsPlumb} from 'jsplumb';
    import _ from 'lodash';


    const dragConfig = {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "sortable-ghost" // dragging class
    };

    const FLOW_STEP_LENGTH = 120;

    const FLOW_LEFT_STEP_LENGTH = 80;

    export default {
        name: "Workflow",
        jsPlumb: null,
        data() {
            return {
                flowTypeConstant: FLOW_TYPE,
                flowItemTypeConstant: FLOW_ITEM_TYPE,
                flowAllList: FLOW_ALL_LIST,
                jsPlumbInit: false,

                dialogObj: {
                    visible: false,
                    editType: undefined,
                    flowUUid: undefined,
                    editForm: undefined,
                    isBetween: false,
                    flowPreUuid: undefined,
                    flowNextUuid: undefined
                },

                dialogVisible: false,
                // flowStart
                flowList: [],
                dragConfig: dragConfig,
                movingFlowItem: undefined, // moving
                movedFlowItem: undefined, //  moved
                canvasDataRoom: 100,
            }
        },
        components: {
            Draggable,
            ListForm,
            StartNodeForm,
            NodeNodeForm,
            IfNodeForm,
            ExpandNodeForm
        },
        mounted() {
            this.$options.jsPlumb = jsPlumb.getInstance();
            this.initJsPlumb();
            this.initFlow();
        },
        computed: {
            dialogFlowItemComponent() {
                return this.dialogObj.editType + 'Form';
            },
            canvasRoomMinusEnable() {
                return this.canvasDataRoom > 50;
            },
            canvasRoomPlusEnable() {
                return this.canvasDataRoom < 100;
            },
            canvasRoomScaleStyle() {
                return {
                    transform: 'scale(' + this.canvasDataRoom / 100 + ')'
                };
            }
        },
        methods: {
            //
            initFlow() {
                let startFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.startNode);
                this.addTempFlowItem(startFlowUuid);
            },

            initJsPlumb() {
                this.$options.jsPlumb.ready(() => {
                    this.jsPlumbInit = true;
                    this.$options.jsPlumb.importDefaults({
                        ConnectionsDetachable: false,
                        LogEnabled: true
                    });
                });
            },

            //
            createFlowConnectionLabel(sourceList, target) {

                if (!Array.isArray(sourceList)) {
                    sourceList = [sourceList];
                }

                sourceList.forEach((source) => {
                    //
                    let lines = this.$options.jsPlumb.getConnections({
                        source: source,
                        target: target
                    });
                    //
                    lines.forEach((line) => {
                        line.getOverlay('nodeTempSmall').setVisible(true);
                        line.bind('click', this.handleFlowLabelClick);
                    });
                });
            },

            createFlowItemLabel(source, target, label) {
                this.$nextTick(() => {
                    let lines = this.$options.jsPlumb.getConnections({
                        source: source,
                        target: target
                    });
                    if (lines.length > 0) {
                        lines[0].getOverlay("flowItemDesc").setLabel(`<span class="node-item-title" title="${label}">${label}</span>`);
                    }
                });
            },

            //
            createFlowItemNum() {

            },

            removeFlowConnection(source, target) {
                //
                let lines = this.$options.jsPlumb.getConnections({
                    source: source,
                    target: target
                });

                lines.forEach((line) => {
                    this.$options.jsPlumb.deleteConnection(line, {force: true});
                });
            },

            //
            handleFlowLabelClick(label) {
                let component = label.component;
                if (component) {
                    let sourceId = component.sourceId;
                    let targetId = component.targetId;
                    this.showDialog({
                        isBetween: true,
                        flowPreUuid: sourceId,
                        flowNextUuid: targetId
                    });
                }
            },

            handleEditFlowItem(flowItem, event) {
                let target = event.currentTarget;


                if (target.dataset.isClick === 'true') {
                    this.showDialog({
                        flowItemType: flowItem.type,
                        flowUuid: flowItem.uuid,
                        flowFormData: flowItem.formData
                    });
                }
            },
            //
            draggableFlowConnect(source, target, isNow) {
                let that = this;

                function doDraw() {
                    if (that.jsPlumbInit) {
                        that.$options.jsPlumb.connect({
                            source: source,
                            target: target,
                            endpoint: 'Dot',
                            // 连接线的样式
                            connectorStyle: {strokeStyle: "#ccc", joinStyle: "round", outlineColor: "#ccc"}, // 链接 style
                            // 连接线配置，起点可用
                            connector: ["Flowchart", {
                                stub: [10, 20],
                                gap: 1,
                                cornerRadius: 2,
                                alwaysRespectStubs: true
                            }], //  链接
                            //
                            endpointStyle: {fill: 'transparent', outlineStroke: 'transparent', outlineWidth: 2},
                            // 线的样式
                            paintStyle: {stroke: 'lightgray', strokeWidth: 2},
                            // 锚点的位置
                            anchor: ['BottomCenter', 'TopCenter'],
                            // 遮罩层-设置箭头
                            overlays: [
                                ['PlainArrow', {width: 10, length: 10, location: 1}],
                                ['Custom', {
                                    location: .5,
                                    id: 'nodeTempSmall',
                                    create: function () {
                                        let $el = that.$refs[target][0].$el;
                                        $el.dataset.target = target;
                                        $el.dataset.source = source;
                                        return $el;
                                    },
                                    visible: false
                                }],
                                ['Label', {location: 1, id: "flowItemDesc", cssClass: "node-item-label", visible: true}] //
                            ]
                        });
                    }
                }

                if (isNow) {
                    doDraw();
                } else {
                    this.$nextTick(() => {
                        doDraw();
                    });
                }

            },

            getFlowItemInitLeft() {
                const $campaignCanvas = this.$refs.campaignCanvas;
                let width = getWidth($campaignCanvas);
                let result = 500;
                if (width) {
                    result = width / 2;
                }
                return result;
            },

            //
            createFlowItem(type, prev, options) {
                options = options || {};
                let _uuid = uuid();
                let flowItem = this.getFlowItemByType(type);
                let lastItemList = [];
                if (flowItem) {
                    //
                    flowItem.prev = [];
                    flowItem.next = [];
                    flowItem.formData = {};
                    flowItem.left = this.getFlowItemInitLeft();
                    flowItem.top = 30;
                    flowItem.uuid = _uuid;
                    flowItem.stepCount = -1;
                    //
                    if (prev) {

                        if (!Array.isArray(prev)) {
                            prev = [prev];
                        }
                        flowItem.prev = prev;

                        //
                        prev.forEach((p) => {
                            // update prev flow item  next list
                            let lastItem = _.find(this.flowList, (item) => {
                                return item.uuid === p;
                            });

                            if (lastItem) {
                                lastItemList.push(lastItem);
                                if (lastItem.next.indexOf(_uuid) === -1) {
                                    lastItem.next.push(_uuid);
                                }
                            }
                        });

                    }
                    //
                    if (lastItemList.length > 0) {
                        if (lastItemList.length === 1) {
                            let prevItem = lastItemList[0];

                            if (options.offsetLeft) {
                                flowItem.left = prevItem.left + options.offsetLeft;
                            } else if (options.left) {
                                flowItem.left = options.left;
                            } else {
                                flowItem.left = prevItem.left;
                            }
                            flowItem.top = prevItem.top + FLOW_STEP_LENGTH;
                        } else {
                            //
                        }
                    }

                    this.flowList.push(flowItem);

                    // support drag
                    this.$nextTick(() => {
                        this.$options.jsPlumb.draggable(_uuid, {});
                    });
                }
                return flowItem ? _uuid : null;
            },
            //
            updateFlowItem(type, preId) {
                // old
                let tempFlowItem = this.getFlow(preId);
                // new
                let newFlowItem = this.getFlowItemByType(type);

                for (let key in newFlowItem) {
                    tempFlowItem[key] = newFlowItem[key];
                }
                return tempFlowItem;
            },

            //
            deleteFlowItem(flowItem) {
                //
                let index = this.getFlowIndex(flowItem.uuid);

                if (this.isOnePreOneNext(flowItem) || this.isEndFlowItem(flowItem)) {
                    this.handleDeleteOnePrevOneNextFlowItem(flowItem, index);
                } else if (this.isHasMoreNextFlowItem(flowItem)) {
                    //  delete if and else
                    this.deleteNextFlowItem(flowItem.uuid);
                    this.addTempFlowItem(flowItem.prev[0]);
                }
            },

            // only has one prev one next flow item
            handleDeleteOnePrevOneNextFlowItem(flowItem, idx) {
                let prevFlowList = [];
                let nextFlowList = [];
                let deleteFlowItem = this.flowList[idx];
                // prev flow list
                // next flow list
                this.flowList.forEach((item) => {
                    if (item.prev.length > 0 && item.prev.indexOf(flowItem.uuid) !== -1) {
                        nextFlowList.push(item);
                    } else if (item.next.length > 0 && item.next.indexOf(flowItem.uuid) !== -1) {
                        prevFlowList.push(item);
                    }
                });

                //
                let expandFlowItem = {};
                if (flowItem.type === FLOW_ITEM_TYPE.endNode && prevFlowList[0].type === FLOW_ITEM_TYPE.expandNode) {
                    expandFlowItem = this.getExpandFlowItem(prevFlowList[0], flowItem.uuid);
                }

                // next flow item delete perv id
                nextFlowList.forEach((item) => {
                    let index = item.prev.indexOf(flowItem.uuid);
                    item.prev.splice(index, 1);
                });

                // prev flow item delete next id
                prevFlowList.forEach((item) => {
                    let index = item.next.indexOf(flowItem.uuid);
                    item.next.splice(index, 1);
                });

                // delete self
                this.flowList.splice(idx, 1);

                this.$nextTick(function () {
                    // delete self
                    this.$options.jsPlumb.removeAllEndpoints(flowItem.uuid);

                    let preFlowItem = prevFlowList[0];
                    let nextFlowItem = nextFlowList[0];

                    if (preFlowItem && nextFlowItem) {
                        // add new id
                        preFlowItem.next.push(nextFlowItem.uuid);
                        nextFlowItem.prev.push(preFlowItem.uuid);
                        // drag connection
                        this.draggableFlowConnect(preFlowItem.uuid, nextFlowItem.uuid, true);
                        // connection label
                        if (nextFlowItem.type !== FLOW_ITEM_TYPE.tempNode) {
                            this.createFlowConnectionLabel(preFlowItem.uuid, nextFlowItem.uuid);
                        }
                        // if prev is ifNode or expandNode need add flow label
                        if (this.isIfFlowItem(preFlowItem.type)) {
                            let isIf = preFlowItem.nextIfId === flowItem.uuid;
                            if (isIf) {
                                preFlowItem.nextIfId = nextFlowItem.uuid;
                            } else {
                                preFlowItem.nextElseId = nextFlowItem.uuid;
                            }
                            this.createFlowItemLabel(preFlowItem.uuid, nextFlowItem.uuid, isIf ? '是' : '否');
                        } else if (this.isExpandFlowItem(preFlowItem.type)) {
                            // need update rule group list;
                            let ruleGroupItem = this.getExpandFlowItem(preFlowItem, deleteFlowItem.uuid);
                            if (ruleGroupItem) {
                                ruleGroupItem.nextStep = nextFlowItem.uuid;
                            }
                            this.createFlowItemLabel(preFlowItem.uuid, nextFlowItem.uuid, ruleGroupItem.name);
                        }
                    }
                    // if delete end node
                    if ((flowItem.type === FLOW_ITEM_TYPE.endNode)) {
                        if (preFlowItem) {
                            // if prev is ifNode or expandNode need add flow label
                            if (this.isIfFlowItem(preFlowItem.type)) {
                                let isIf = preFlowItem.nextIfId === flowItem.uuid;
                                //  create one flow item
                                let tempFlowUuid = this.addIfOneTempFlowItem(preFlowItem.uuid, isIf);
                                if (isIf) {
                                    preFlowItem.nextIfId = tempFlowUuid;
                                } else {
                                    preFlowItem.nextElseId = tempFlowUuid;
                                }
                            } else if (this.isExpandFlowItem(preFlowItem.type)) {
                                // create one flow item
                                let tempFlowUuid = this.addExpandOneTempFlowItem(preFlowItem, flowItem.left, expandFlowItem.name);
                                expandFlowItem.nextStep = tempFlowUuid;
                            } else {
                                // add temp flow item
                                this.addTempFlowItem(preFlowItem.uuid);
                            }
                        }
                    }
                });
            },

            plumbRepaintEverything() {
                this.$nextTick(() => {
                    this.$options.jsPlumb.repaintEverything();
                });
            },


            getFlowItemById(id) {
                let result = null;

                Object.keys(FLOW_LIST).forEach((group) => {
                    let groupList = FLOW_LIST[group];
                    if (groupList && groupList.length > 0) {
                        //
                        let item = _.find(groupList, (item) => {
                            return item.id === id;
                        });

                        if (item) {
                            result = clone(item);
                        }
                    }
                });
                return result;
            },

            getFlowItemByType(type) {
                let result = null;

                Object.keys(FLOW_LIST).forEach((group) => {
                    let groupList = FLOW_LIST[group];
                    if (groupList && groupList.length > 0) {

                        let item = _.find(groupList, (item) => {
                            return item.type === type;
                        });

                        if (item) {
                            result = clone(item);
                        }
                    }
                });
                return result;
            },


            //
            handleFlowMoveItem(evt) {
                let $to = evt.to;
                let $dragged = evt.dragged;
                if ($dragged.dataset.id === FLOW_ITEM_TYPE.startNode) {
                    return false;
                }

                if (!this.movedFlowItem) {
                    this.movedFlowItem = $to;
                    addClass($to, 'is-active');
                }
                // change target item
                else if (this.movedFlowItem && this.movedFlowItem !== $to) {
                    removeClass(this.movedFlowItem, 'is-active');
                    this.movedFlowItem = $to;
                    addClass($to, 'is-active');
                }
            },

            //
            handleDeleteFlowItem(flowItem) {
                this.$confirm('确定要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteFlowItem(flowItem);
                }).catch(() => {

                });
            },

            //
            handleFlowMoveStart(evt) {
                let item = evt.item;
                let dataset = item.dataset;
                this.movingFlowItem = {
                    group: dataset.group,
                    type: dataset.type
                };
            },

            handleFlowMoveEnd(evt) {
                const originalEvent = evt.originalEvent;
                if (this.movedFlowItem) {
                    removeClass(this.movedFlowItem, 'is-active');
                    if (originalEvent.toElement !== this.movedFlowItem) {
                        this.movedFlowItem = undefined;
                        this.movingFlowItem = undefined;
                        return;
                    }
                    let obj = {
                        flowItemType: this.movingFlowItem.type,
                        flowUuid: this.movedFlowItem.id,
                    };

                    if (this.movedFlowItem.dataset.source && this.movedFlowItem.dataset.target) {
                        obj.isBetween = true;
                        obj.flowPreUuid = this.movedFlowItem.dataset.source;
                        obj.flowNextUuid = this.movedFlowItem.dataset.target;
                        delete obj.flowUuid;
                    }

                    this.showDialog(obj);
                }

                this.movedFlowItem = undefined;
                this.movingFlowItem = undefined;
            },

            //
            handleSelectFlowItem(flowItem) {
                //
                if (flowItem.type === FLOW_ITEM_TYPE.endNode) {
                    if (this.dialogObj.isBetween) {
                        // add end flow item and remove next all
                        let prevFlowId = this.dialogObj.flowPreUuid;
                        let nextFlowId = this.dialogObj.flowNextUuid;
                        this.deleteNextFlowItem(nextFlowId);

                        this.$nextTick(() => {
                            // temp
                            let tempFlowUuid = this.addTempFlowItem(prevFlowId);
                            this.$nextTick(() => {
                                this.handleAddFlowItem(flowItem.type, tempFlowUuid);
                            });
                        });
                    } else {
                        this.handleAddFlowItem(flowItem.type, this.dialogObj.flowUUid);
                    }
                    this.initDialog();
                    return;
                }

                //
                this.showDialog({
                    flowItemType: flowItem.type,
                    flowUuid: this.dialogObj.flowUUid
                });
            },


            // add flow item
            handleAddFlowItem(flowItemType, tempFlowId) {
                //
                let newFlowItem = this.updateFlowItem(flowItemType, tempFlowId);
                // connection label
                this.createFlowConnectionLabel(newFlowItem.prev, newFlowItem.uuid);
                // action or wait node
                if (this.isOnePreOneNext(newFlowItem)) {
                    //
                    this.addTempFlowItem(tempFlowId);
                } else if (newFlowItem.groupType === FLOW_TYPE.condition) {
                    if (this.isIfFlowItem(flowItemType)) {
                        // add if temp flow item and else temp flow item
                        this.addIfTempFlowItem(tempFlowId);
                    }
                    //
                    else if (this.isExpandFlowItem(flowItemType)) {
                        this.addExpandTempFlowItem(tempFlowId, newFlowItem.formData.ruleGroupList);
                    }
                }

                return newFlowItem;
            },

            // update flow item
            handleUpdateFlowItem(options) {
                let {flowItemType, tempFlowId} = options;

                let preFlowItem = this.getFlow(tempFlowId);
                let isPrevHasMoreNext = false;
                // update new flow item
                let newFlowItem = this.updateFlowItem(flowItemType, tempFlowId);
                // if update new flow type
                if (flowItemType !== preFlowItem.type) {
                    // update old flow item
                    if (this.isHasMoreNextFlowItem(preFlowItem)) {
                        isPrevHasMoreNext = true;
                        preFlowItem.next.forEach((id) => {
                            this.deleteNextFlowItem(id);
                        });
                    }
                    if (this.isIfFlowItem(flowItemType)) {
                        this.handleUpdateIfFlowItem(newFlowItem);
                    } else if (this.isExpandFlowItem(flowItemType)) {
                        this.handleUpdateExpandFlowItem(newFlowItem);
                    } else {
                        if (isPrevHasMoreNext) {
                            this.addTempFlowItem(newFlowItem.uuid);
                        }
                    }
                } else {
                    // update self item
                    // compare groupList and next
                    // todo: 待完成
                    if (this.isExpandFlowItem(flowItemType)) {
                        const ruleGroupList = newFlowItem.formData.ruleGroupList;
                        const nextList = newFlowItem.next;
                        const newNextList = [];

                        const addRuleGroupList = [];
                        let deleteUUidList = [];
                        //
                        ruleGroupList.forEach((ruleGroupItem) => {
                            const nextStep = ruleGroupItem.nextStep;
                            if (nextStep) {
                                newNextList.push(nextStep);
                                //  update group item label name;
                                this.createFlowItemLabel(newFlowItem.uuid, nextStep, ruleGroupItem.name);
                            } else {
                                addRuleGroupList.push(ruleGroupItem);
                            }
                        });
                        // delete item
                        deleteUUidList = _.difference(nextList, newNextList);

                        if (deleteUUidList.length > 0) {
                            // update next
                            newFlowItem.next = newNextList;
                            deleteUUidList.forEach((uuid) => {
                                this.deleteNextFlowItem(uuid);
                            });
                        }

                        if (addRuleGroupList.length > 0) {
                            let leftPosition = 0;
                            newFlowItem.next.forEach((uuid) => {
                                let flowItem = this.getFlow(uuid);
                                if (leftPosition < flowItem.left) {
                                    leftPosition = flowItem.left;
                                }
                            });
                            // need last left
                            addRuleGroupList.forEach((ruleGroupItem, index) => {
                                let left = leftPosition + (index + 1) * (FLOW_LEFT_STEP_LENGTH * 2);
                                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, newFlowItem.uuid, {left});
                                this.draggableFlowConnect(newFlowItem.uuid, tempFlowUuid);
                                this.createFlowItemLabel(newFlowItem.uuid, tempFlowUuid, ruleGroupItem.name);
                                ruleGroupItem.nextStep = tempFlowUuid;
                            })
                        }
                    }
                }
            },

            // update if flow item
            // delete next nodes
            handleUpdateIfFlowItem(flowItem) {
                flowItem.next.forEach((id) => {
                    this.deleteNextFlowItem(id);
                });
                this.$nextTick(() => {
                    this.addIfTempFlowItem(flowItem.uuid);
                });
            },

            // update expand flow item
            // delete next nodes
            handleUpdateExpandFlowItem(flowItem) {
                flowItem.next.forEach((id) => {
                    this.deleteNextFlowItem(id);
                });
                this.$nextTick(() => {
                    this.addExpandTempFlowItem(flowItem.uuid, flowItem.formData.ruleGroupList);
                });
            },

            //
            handleAddBetweenFlowItem(options) {
                let {flowItemType, preFlowId, nextFlowId, formData} = options;
                // if step is if node
                if (this.isIfFlowItem(flowItemType) || this.isExpandFlowItem(flowItemType)) {
                    this.deleteNextFlowItem(nextFlowId);
                    this.$nextTick(() => {
                        let tempFlowUuid = this.addTempFlowItem(preFlowId);
                        let tempFlowItem = this.getFlow(tempFlowUuid);
                        tempFlowItem.formData = formData;
                        this.$nextTick(() => {
                            this.handleAddFlowItem(flowItemType, tempFlowUuid);
                        });
                    });
                } else {
                    this.handleAddBetweenCommonFlowItem(options);
                }
            },

            handleAddBetweenCommonFlowItem(opts) {
                let {flowItemType, preFlowId, nextFlowId, formData} = opts;
                // update flow position
                let prevFlowItem = this.getFlow(preFlowId);
                let options = {};
                //
                let flowItemUuid = this.createFlowItem(flowItemType, preFlowId, options);
                // prev flow item is if flow item
                if (this.isIfFlowItem(prevFlowItem.type)) {
                    let nextFlowItem = this.getFlow(nextFlowId);
                    let isIf = prevFlowItem.nextIfId === nextFlowItem.uuid;
                    if (isIf) {
                        prevFlowItem.nextIfId = flowItemUuid;
                        options.offsetLeft = -FLOW_LEFT_STEP_LENGTH;
                    } else {
                        prevFlowItem.nextElseId = flowItemUuid;
                        options.offsetLeft = FLOW_LEFT_STEP_LENGTH;
                    }
                } else if (this.isExpandFlowItem(prevFlowItem.type)) {
                    let nextFlowItem = this.getFlow(nextFlowId);
                    options.offsetLeft = nextFlowItem.left - prevFlowItem.left;
                }

                let flowItem = this.getFlow(flowItemUuid);
                flowItem.formData = formData;
                flowItem.next.push(nextFlowId);
                //
                this.$nextTick(() => {
                    this.updateBetweenFlowItem(flowItemUuid, nextFlowId, preFlowId);

                    if (this.isIfFlowItem(prevFlowItem.type)) {
                        this.createFlowItemLabel(preFlowId, flowItemUuid, options.offsetLeft > 0 ? '是' : '否`');
                    } else if (this.isExpandFlowItem(prevFlowItem.type)) {
                        let name = this.getExpandFlowItemName(prevFlowItem, flowItemUuid);
                        this.createFlowItemLabel(preFlowId, flowItemUuid, name);
                    }
                });
            },

            //
            getExpandFlowItemName(expandFlowItem, tempFlowUuid) {
                let ruleGroupItem = this.getExpandFlowItem(expandFlowItem, tempFlowUuid);
                let name = '';
                if (ruleGroupItem) {
                    name = ruleGroupItem.name;
                }
                return name;
            },

            getExpandFlowItem(expandFlowItem, tempFlowUuid) {
                let ruleGroupList = expandFlowItem.formData.ruleGroupList;

                let ruleGroupItem = _.find(ruleGroupList, (groupItem) => {
                    return groupItem.nextStep === tempFlowUuid;
                });

                return ruleGroupItem;
            },

            //
            updateBetweenFlowItem(flowItemUuid, nextFlowId, preFlowId) {

                // prev flow item
                let preFlowItem = this.getFlow(preFlowId);

                // pre flow item remove next next flow
                let preNextIndex = preFlowItem.next.indexOf(nextFlowId);
                if (preNextIndex !== -1) {
                    preFlowItem.next.splice(nextFlowId, 1);
                }

                // prev flow item add current flow
                let flowItemIndex = preFlowItem.next.indexOf(flowItemUuid);
                if (flowItemIndex === -1) {
                    preFlowItem.next.push(flowItemUuid);
                }

                // has one prev
                let nextFlowItem = this.getFlow(nextFlowId);
                nextFlowItem.prev = [flowItemUuid];

                // remove flow connection
                this.removeFlowConnection(preFlowId, nextFlowId);
                //
                this.addFlowItemConnect(preFlowId, flowItemUuid);
                this.addFlowItemConnect(flowItemUuid, nextFlowId);

                // move flow
                this.moveFlowItem(nextFlowId);
                //
                this.plumbRepaintEverything();
            },


            moveFlowItem(flowUuid) {
                let flowItem = this.getFlow(flowUuid);

                if (flowItem.prev.length > 0) {
                    let prevItem = this.getFlow(flowItem.prev[0]);
                    flowItem.top = prevItem.top + FLOW_STEP_LENGTH;
                }
                // update next
                flowItem.next.forEach((id) => {
                    this.moveFlowItem(id);
                });
            },

            deleteNextFlowItem(flowUuid) {
                let flowItem = this.getFlow(flowUuid);
                let index = this.getFlowIndex(flowUuid);

                if (!flowItem) {
                    return;
                }

                this.flowList.splice(index, 1);

                this.$nextTick(() => {
                    // delete self
                    this.$options.jsPlumb.removeAllEndpoints(flowItem.uuid);
                });

                flowItem.next.forEach((id) => {
                    this.deleteNextFlowItem(id);
                });
            },

            getFlow(flowUuid) {
                let flowItem = _.find(this.flowList, (item) => {
                    return item.uuid === flowUuid;
                });

                return flowItem;
            },

            getFlowIndex(flowUuid) {
                let index = _.findIndex(this.flowList, (item) => {
                    return item.uuid === flowUuid;
                });

                return index;
            },


            // temp flow
            addTempFlowItem(preUuid) {
                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid);
                this.draggableFlowConnect(preUuid, tempFlowUuid);
                return tempFlowUuid;
            },

            //
            addIfTempFlowItem(preUuid) {
                let preTempItem = this.getFlow(preUuid);
                // if
                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, {offsetLeft: -FLOW_LEFT_STEP_LENGTH});
                this.draggableFlowConnect(preUuid, tempFlowUuid);
                this.createFlowItemLabel(preUuid, tempFlowUuid, '是');
                preTempItem.nextIfId = tempFlowUuid;
                //  else
                let tempFlowUuid2 = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, {offsetLeft: FLOW_LEFT_STEP_LENGTH});
                this.draggableFlowConnect(preUuid, tempFlowUuid2);
                this.createFlowItemLabel(preUuid, tempFlowUuid2, '否');
                preTempItem.nextElseId = tempFlowUuid2;
            },


            addIfOneTempFlowItem(preUuid, isIf) {
                let leftPosition = isIf ? -FLOW_LEFT_STEP_LENGTH : FLOW_LEFT_STEP_LENGTH;
                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, {offsetLeft: leftPosition});
                this.draggableFlowConnect(preUuid, tempFlowUuid);
                this.createFlowItemLabel(preUuid, tempFlowUuid, isIf ? '是' : '否');
                return tempFlowUuid;
            },

            // add expand temp flow items
            addExpandTempFlowItem(preUuid, ruleGroups) {
                let length = ruleGroups.length;
                // is even
                let isEven = length % 2 === 0;
                let centerIndex = parseInt(length / 2, 10);
                centerIndex = isEven ? centerIndex - 1 : centerIndex;
                let tempItem;
                let options = {};
                // left
                for (let i = 0; i <= centerIndex; i++) {
                    tempItem = ruleGroups[i];
                    let tempLength = isEven ? (centerIndex - i) : (centerIndex - i);
                    let leftLength = tempLength * (FLOW_LEFT_STEP_LENGTH * 2);
                    if (isEven) {
                        leftLength = leftLength + FLOW_LEFT_STEP_LENGTH;
                    }
                    options.offsetLeft = -leftLength;
                    let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, options);
                    this.draggableFlowConnect(preUuid, tempFlowUuid);
                    this.createFlowItemLabel(preUuid, tempFlowUuid, tempItem.name);
                    tempItem.nextStep = tempFlowUuid;
                }
                // right
                for (let i = centerIndex + 1; i < length; i++) {
                    tempItem = ruleGroups[i];
                    let tempLength = isEven ? (i - (centerIndex + 1)) : (i - centerIndex);
                    let leftLength = tempLength * (FLOW_LEFT_STEP_LENGTH * 2);
                    if (isEven) {
                        leftLength = leftLength + FLOW_LEFT_STEP_LENGTH;
                    }
                    options.offsetLeft = leftLength;
                    let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, options);
                    this.draggableFlowConnect(preUuid, tempFlowUuid);
                    this.createFlowItemLabel(preUuid, tempFlowUuid, tempItem.name);
                    tempItem.nextStep = tempFlowUuid;
                }
            },


            addExpandOneTempFlowItem(preFlowItem, left, expandFlowItemName) {
                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preFlowItem.uuid, {left: left});
                this.draggableFlowConnect(preFlowItem.uuid, tempFlowUuid);
                this.createFlowItemLabel(preFlowItem.uuid, tempFlowUuid, expandFlowItemName);
                return tempFlowUuid;
            },

            // add flow connection and label
            addFlowItemConnect(prevId, nextId) {
                this.draggableFlowConnect(prevId, nextId, true);
                this.createFlowConnectionLabel(prevId, nextId);
            },

            /**
             * handle update change flow position by drag
             * @param flowItem
             * @param evt
             */
            handleChangeFlowPosition(flowItem, evt) {
                const target = evt.currentTarget;
                let left = ('' + target.style.left).replace('px', '');
                let top = ('' + target.style.top).replace('px', '');
                flowItem.left = Number(left);
                flowItem.top = Number(top);

                let firstTime = target.dataset.firstTime;
                let lastTime = new Date().getTime();

                target.dataset.isClick = lastTime - firstTime < 200;
            },

            handleFlowMoveDown(evt) {
                const target = evt.currentTarget;
                target.dataset.firstTime = new Date().getTime();
            },

            handleTempFlowFormData() {
                let $flowEditComponent = this.$refs.flowEditComponent;

                if (!$flowEditComponent || !$flowEditComponent.validateFormData) {
                    return;
                }

                // validate
                $flowEditComponent.validateFormData().then(() => {
                    let formData = $flowEditComponent.formData();

                    // between
                    if (this.dialogObj.isBetween) {
                        this.handleAddBetweenFlowItem({
                            flowItemType: this.dialogObj.editType,
                            preFlowId: this.dialogObj.flowPreUuid,
                            nextFlowId: this.dialogObj.flowNextUuid,
                            formData
                        });
                    } else {
                        // click item
                        let flowItem = this.getFlow(this.dialogObj.flowUUid);
                        // update form data
                        flowItem.formData = formData;
                        // create
                        if (flowItem.type === FLOW_ITEM_TYPE.tempNode) {
                            this.handleAddFlowItem(this.dialogObj.editType, flowItem.uuid);
                        } else {
                            // update flow item
                            this.handleUpdateFlowItem({
                                flowItemType: this.dialogObj.editType,
                                tempFlowId: flowItem.uuid
                            });
                        }
                    }
                    this.initDialog();
                }).catch(() => {

                });
            },

            handleCloseDialog() {
                this.initDialog();
            },

            //
            handleGoList() {
                this.dialogObj.editType = FLOW_ITEM_TYPE.list;
            },

            showDialog(obj) {
                if (obj.isBetween) {
                    this.dialogObj.isBetween = true;
                    this.dialogObj.flowPreUuid = obj.flowPreUuid;
                    this.dialogObj.flowNextUuid = obj.flowNextUuid;
                    this.dialogObj.editType = obj.flowItemType || FLOW_ITEM_TYPE.list;
                } else {
                    //
                    if (obj.flowItemType === FLOW_ITEM_TYPE.endNode) {
                        this.handleAddFlowItem(obj.flowItemType, obj.flowUuid);
                        return;
                    }
                    this.dialogObj.editType = obj.flowItemType;
                    this.dialogObj.flowUUid = obj.flowUuid;
                    //
                    if (obj.flowFormData) {
                        this.dialogObj.editForm = obj.flowFormData;
                    }

                    if (obj.flowItemType === FLOW_ITEM_TYPE.tempNode) {
                        this.dialogObj.editType = FLOW_ITEM_TYPE.list;
                    }
                }

                this.dialogObj.visible = true;
            },

            initDialog() {
                this.dialogObj.visible = false;
                this.dialogObj.flowUUid = undefined;
                this.dialogObj.editType = undefined;
                this.dialogObj.isBetween = false;
                this.dialogObj.flowPreUuid = undefined;
            },


            formatData() {
                let result = {};

                let positionObj = {};
                let steps = [];
                let name = '';
                let flowList = clone(this.flowList);
                flowList.forEach((flowItem) => {
                    //
                    if (flowItem.type === FLOW_ITEM_TYPE.startNode) {
                        name = flowItem.formData.stepName;
                    }

                    let step = {
                        elementId: flowItem.id,
                        stepId: flowItem.uuid,
                    };

                    if (flowItem.next.length > 1) {
                        // next step
                        if (this.isIfFlowItem(flowItem.type)) {
                            let ruleGroups = flowItem.formData.ruleGroups || [];
                            let nextStepLeft = {
                                nextStep: flowItem.nextIfId,
                                name: '是',
                                isDefault: false,
                                ruleGroups: ruleGroups
                            };
                            let nextStepRight = {
                                nextStep: flowItem.nextElseId,
                                name: '否',
                                isDefault: true,
                                ruleGroups: []
                            };
                            // if else
                            step.nextSteps = [nextStepLeft, nextStepRight];
                            step.stepName = flowItem.formData.stepName;
                            step.stepJson = JSON.stringify({ifNodeTitle: flowItem.formData.ifNodeTitle});
                        } else if (this.isExpandFlowItem(flowItem.type)) {
                            // expand flow item
                            let ruleGroupList = flowItem.formData.ruleGroupList;
                            let nextSteps = [];
                            ruleGroupList.forEach((ruleGroup) => {
                                let item = {
                                    nextStep: ruleGroup.nextStep, //
                                    name: ruleGroup.name,
                                    ruleGroups: ruleGroup.ruleGroups,
                                    isDefault: !!ruleGroup.isDefault
                                };
                                nextSteps.push(item);
                            });
                            step.nextSteps = nextSteps;
                            step.stepName = flowItem.formData.stepName;
                        } else {
                            // 数组
                            step.nextSteps = flowItem.next.map((id) => {
                                return {
                                    nextStep: id
                                };
                            });
                        }
                    } else {
                        step.nextStep = flowItem.next[0] || null;
                    }

                    // if and expand
                    if (!this.isIfFlowItem(flowItem.type) && !this.isExpandFlowItem(flowItem.type)) {
                        step = Object.assign(step, flowItem.formData);
                    }

                    steps.push(step);
                    positionObj[flowItem.uuid] = {
                        left: flowItem.left,
                        top: flowItem.top
                    };
                });
                result.position = positionObj;
                result.steps = steps;

                return result;
            },

            handleMinusCanvas() {
                if (this.canvasDataRoom <= 50) {
                    return;
                }

                this.canvasDataRoom = this.canvasDataRoom - 10;
            },

            handlePlusCanvas() {
                if (this.canvasDataRoom === 100) {
                    return;
                }
                this.canvasDataRoom = this.canvasDataRoom + 10;

            },


            handleSort() {
                this.$alert('开发中。。。')
            },

            handleClear() {
                this.$confirm('确定要清空数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$alert('开发中。。。')
                }).catch(() => {

                });
            },

            handleGetData() {
                const formData = this.formatData();
                const formatter = new JSONFormatter(formData, 3);
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.preShow.appendChild(formatter.render());
                })
            },

            //
            _message(msg, type) {
                this.$message({
                    type: type || 'error',
                    message: msg
                });
            },

            isOnePreOneNext(flowItem) {
                return flowItem.groupType === FLOW_TYPE.action ||
                    flowItem.type === FLOW_ITEM_TYPE.waitNode;
            },

            isEndFlowItem(flowItem) {
                return flowItem.type === FLOW_ITEM_TYPE.endNode;
            },

            isIfFlowItem(flowItemType) {
                return flowItemType === FLOW_ITEM_TYPE.ifNode;
            },

            isExpandFlowItem(flowItemType) {
                return flowItemType === FLOW_ITEM_TYPE.expandNode;
            },

            isHasMoreNextFlowItem(flowItem) {
                return this.isIfFlowItem(flowItem.type) || this.isExpandFlowItem(flowItem.type);
            },

            isHasStepCountFlowItem(flowItem) {
                return flowItem.groupType === FLOW_TYPE.action || flowItem.type === FLOW_ITEM_TYPE.startNode;
            }
        }
    }
</script>

<style lang="sass">
    @import "../styles/workflow.scss"
</style>
