<template>
    <div class="flow-layout">
        <div class="flow-editor">
            <div class="flow-tools">
                <el-tooltip class="item" effect="dark" content="自动排列" placement="top-start">
                    <div class="tool-item" title="" @click="handleSort">
                        <span class="icon-duiqi"></span>
                    </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="撤销" placement="top-start">
                    <div class="tool-item" @click="handleUndo">
                        <span class="icon-undo" :class="{'icon-undo-disabled':!canUndo}"></span>
                    </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="重做" placement="top-start">
                    <div class="tool-item" @click="handleClear">
                        <span class="icon-redo"></span>
                    </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="获取JSON数据" placement="top-start">
                    <div class="tool-item" @click="handleGetData">
                        <span class="icon-json"></span>
                    </div>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="网格" placement="top-start">
                    <div class="tool-item" @click="toggleGridLine = !toggleGridLine">
                        <span :class="toggleGridLineClass"></span>
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
            <div class="canvas-container" :class="{'show-grid':toggleGridLine}" :data-zoom="canvasDataRoom">
                <div id="campaignCanvas" :style="canvasRoomScaleStyle" ref="campaignCanvas">
                    <template v-for="(flowItem,index) in flowList">
                        <div class="node-content-wrap"
                             :key="flowItem.uuid"
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
    import ExpandNodeForm from './expandNodeForm';
    import {workflowItem, workflowItem2} from "../mock/mock";

    import {jsPlumb} from 'jsplumb';
    import _ from 'lodash';

    let MEMORY_LIST = [];

    const dragConfig = {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "sortable-ghost" // dragging class
    };

    const FLOW_STEP_LENGTH = 120;

    const FLOW_LEFT_STEP_LENGTH = 80;

    const FLOW_IF_OFFSET_LENGTH = 30;

    const FLOW_START_STEP_TOP = 30;

    const INIT_DATA = workflowItem2;

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
                toggleGridLine: true,
                canUndo: false,
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
            if (INIT_DATA.steps.length > 0) {
                this.updateFlow(INIT_DATA);
            } else {
                this.initFlow();
            }
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
            },
            toggleGridLineClass() {
                return this.toggleGridLine ? 'icon-wangge-open' : 'icon-wangge-close';
            }
        },
        methods: {
            // init flow
            // create startFlow and tempFlow
            initFlow() {
                let startFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.startNode);
                this.addTempFlowItem(startFlowUuid);
            },

            updateFlow(editItem, callback) {
                let positions = JSON.parse(editItem.positions);
                let steps = editItem.steps;
                let flowList = [];

                steps.forEach((step) => {
                    let flowItem = this.getFlowItemById(step.elementId);

                    if (!flowItem) {
                        return;
                    }
                    flowItem.next = [];
                    flowItem.prev = [];
                    flowItem.uuid = step.stepId;

                    let position = positions[step.stepId];

                    if (position) {
                        flowItem.left = position.left;
                        flowItem.top = position.top;
                    }

                    if (step.nextStep) {
                        flowItem.next = [step.nextStep];
                    } else if (step.nextSteps) {
                        flowItem.next = step.nextSteps.map((nextStep) => {
                            return nextStep.nextStep;
                        });
                    }

                    if (flowItem.type !== FLOW_ITEM_TYPE.endNode) {
                        //
                        if (this.isIfFlowItem(flowItem.type)) {
                            let formData = clone(step.nextSteps[0]);
                            formData.stepName = step.stepName;
                            flowItem.formData = this.getFlowItemFormData(formData);
                            // else
                            if (formData.isDefault) {
                                flowItem.nextElseId = formData.nextStep;
                                flowItem.nextIfId = step.nextSteps[1].nextStep;
                            } else {
                                flowItem.nextIfId = formData.nextStep;
                                flowItem.nextElseId = step.nextSteps[1].nextStep;
                            }
                            if (step.stepJson) {
                                let stepOtherObj = JSON.parse(step.stepJson);
                                flowItem.formData.ifNodeTitle = stepOtherObj.ifNodeTitle;
                            }
                        } else if (this.isExpandFlowItem(flowItem.type)) {
                            let ruleGroupList = step.nextSteps;
                            let formData = {};
                            formData.stepName = step.stepName;
                            formData.ruleGroupList = ruleGroupList;
                            flowItem.formData = formData;
                        } else {
                            flowItem.formData = this.getFlowItemFormData(step);
                        }
                    }

                    flowList.push(flowItem);
                });

                // update
                flowList.forEach((item) => {
                    if (item.next.length > 0) {
                        item.next.forEach((id) => {
                            let nextItem = _.find(flowList, (tempItem) => {
                                return tempItem.uuid === id;
                            });

                            if (nextItem) {
                                if (nextItem.prev.indexOf(item.uuid) === -1) {
                                    nextItem.prev.push(item.uuid);
                                }
                            }
                        });
                    }
                });
                this.flowList = flowList;

                this.$nextTick(() => {
                    //
                    flowList.forEach((item) => {
                        this.$options.jsPlumb.draggable(item.uuid, {});
                    });

                    this.$nextTick(() => {
                        flowList.forEach((item) => {
                            item.next.forEach((id, index) => {
                                let nextFlowItem = this.getFlow(id);
                                if (!this.isTempFlowItem(nextFlowItem)) {
                                    this.addFlowItemConnect(item.uuid, id);
                                } else {
                                    this.draggableFlowConnect(item.uuid, id, true);
                                }
                                //
                                if (this.isIfFlowItem(item.type)) {
                                    let isIf = item.nextIfId === nextFlowItem.uuid;
                                    this.createFlowItemLabel(item.uuid, id, isIf ? '是' : '否');
                                } else if (this.isExpandFlowItem(item.type)) {
                                    let name = this.getExpandFlowItemName(item, id);
                                    this.createFlowItemLabel(item.uuid, id, name);
                                }
                            });
                        });
                        this.$nextTick(() => {
                            callback && callback();
                        })
                    });
                });
            },

            $_updateMemoryList() {
                console.log('$_updateMemoryList');
                const tempItem = this.formatData();

                // max store is 10
                if (MEMORY_LIST.length > 10) {
                    MEMORY_LIST.shift();
                }
                MEMORY_LIST.push(tempItem);
                console.log(MEMORY_LIST);

                this.$_updateCanUndoBtn();
            },

            $_updateCanUndoBtn() {
                this.canUndo = MEMORY_LIST.length > 0;
            },

            // init js plumb
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

            removeFlowConnection(source, target) {
                //
                let lines = this.$options.jsPlumb.getConnections({
                    source: source,
                    target: target
                });

                lines.forEach((line) => {
                    this.$options.jsPlumb.deleteConnection(line);
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
                    flowItem.top = FLOW_START_STEP_TOP;
                    flowItem.uuid = _uuid;
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

            // delete flow item
            deleteFlowItem(flowItem) {
                //
                if (this.isOnePreOneNext(flowItem) || this.isEndFlowItem(flowItem)) {
                    //
                    let index = this.getFlowIndex(flowItem.uuid);
                    this.handleDeleteOnePrevOneNextFlowItem(flowItem, index);
                }
                // delete item is has more flow item like ifElse or expand flow item
                else if (this.isHasMoreNextFlowItem(flowItem)) {
                    //  delete next flow item
                    this.deleteNextFlowItem(flowItem.uuid);

                    const preFlowItem = this.getFlow(flowItem.prev[0]);
                    // pre is ifElse
                    if (this.isIfFlowItem(preFlowItem.type)) {
                        this.addIfOneTempFlowItem(preFlowItem.uuid, preFlowItem.nextIfId === flowItem.uuid)
                    }
                    // pre is expand expand
                    else if (this.isExpandFlowItem(preFlowItem.type)) {
                        // this.addTempFlowItem(flowItem.prev[0]);
                        const expandFlowItem = this.getExpandFlowItem(preFlowItem, flowItem.uuid);
                        this.addExpandOneTempFlowItem(preFlowItem, flowItem.left, expandFlowItem.name);
                    } else {
                        //
                        this.addTempFlowItem(flowItem.prev[0]);
                    }
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
                // todo
                // delete end points
                this.$options.jsPlumb.removeAllEndpoints(flowItem.uuid, true);
                this.flowList.splice(idx, 1);

                this.$nextTick(function () {
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
                                this.addIfOneTempFlowItem(preFlowItem.uuid, isIf);
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

                    this.$nextTick(() => {
                        if (nextFlowItem) {
                            this.moveFlowItem(nextFlowItem.uuid);
                            this.$_plumbRepaintEverything();
                        }
                    });
                });
            },

            //
            $_plumbRepaintEverything() {
                this.$nextTick(() => {
                    this.$options.jsPlumb.repaintEverything(true);
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
                this.$confirm('确定要删除吗？Tips: ifNode 和 expandNode 会删除下面所有节点', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$_updateMemoryList();
                    this.deleteFlowItem(flowItem);
                }).catch((e) => {
                    console.warn(e);
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
                    this.$_updateMemoryList();
                    if (this.dialogObj.isBetween) {
                        // add end flow item and remove next all
                        let prevFlowId = this.dialogObj.flowPreUuid;
                        let nextFlowId = this.dialogObj.flowNextUuid;

                        const preFlow = this.getFlow(prevFlowId);
                        let options = {};
                        if (this.isHasMoreNextFlowItemByType(preFlow.type)) {
                            const nextFlow = this.getFlow(nextFlowId);
                            options.left = nextFlow.left;
                        }
                        this.deleteNextFlowItem(nextFlowId);
                        this.$nextTick(() => {
                            // temp
                            let tempFlowUuid = this.addTempFlowItem(prevFlowId, options);
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
                // update flow item
                let newFlowItem = this.updateFlowItem(flowItemType, tempFlowId);
                // connection label
                this.createFlowConnectionLabel(newFlowItem.prev, newFlowItem.uuid);
                // action or wait node
                if (this.isOnePreOneNext(newFlowItem)) {
                    this.addTempFlowItem(tempFlowId);
                } else if (newFlowItem.groupType === FLOW_TYPE.condition) {
                    const preFlowItem = this.getFlow(newFlowItem.prev[0]);
                    if (this.isIfFlowItem(flowItemType)) {
                        // if pre node is ifElse
                        if (this.isIfFlowItem(preFlowItem.type)) {
                            if (preFlowItem.nextIfId === newFlowItem.uuid) {
                                newFlowItem.left -= FLOW_IF_OFFSET_LENGTH;
                            } else if (preFlowItem.nextElseId === newFlowItem.uuid) {
                                newFlowItem.left += FLOW_IF_OFFSET_LENGTH;
                            }
                        }
                        // add if temp flow item and else temp flow item
                        this.addIfTempFlowItem(tempFlowId);
                    }
                    //
                    else if (this.isExpandFlowItem(flowItemType)) {
                        // if pre node is ifElse
                        if (this.isIfFlowItem(preFlowItem.type)) {
                            const nextLength = newFlowItem.formData.ruleGroupList.length;
                            let isEven = nextLength % 2 === 0;
                            let centerIndex = parseInt(nextLength / 2, 10);
                            const offset = (isEven ? centerIndex : centerIndex + 1) * FLOW_LEFT_STEP_LENGTH + FLOW_IF_OFFSET_LENGTH;
                            if (preFlowItem.nextIfId === newFlowItem.uuid) {
                                newFlowItem.left -= offset;
                            } else if (preFlowItem.nextElseId === newFlowItem.uuid) {
                                newFlowItem.left += offset;
                            }
                        }
                        this.addExpandTempFlowItem(tempFlowId, newFlowItem.formData.ruleGroupList);
                    }
                    this.$_plumbRepaintEverything();
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
                // if step is ifElse of Expand
                // need delete next all flow
                if (this.isHasMoreNextFlowItemByType(flowItemType)) {
                    const options = {};
                    const preFlow = this.getFlow(preFlowId);
                    const isPreFlowExpandType = this.isExpandFlowItem(preFlow.type);
                    let expandFormData = isPreFlowExpandType ? preFlow.formData : null;
                    // pre flow is more next flow
                    if (this.isHasMoreNextFlowItemByType(preFlow.type)) {
                        const nextFlow = this.getFlow(nextFlowId);
                        options.left = nextFlow.left;
                    }
                    this.deleteNextFlowItem(nextFlowId);
                    this.$nextTick(() => {
                        let tempFlowUuid = this.addTempFlowItem(preFlowId, options);
                        let tempFlowItem = this.getFlow(tempFlowUuid);
                        tempFlowItem.formData = formData;
                        this.$nextTick(() => {
                            this.handleAddFlowItem(flowItemType, tempFlowUuid);
                            if (isPreFlowExpandType) {
                                this.updateExpandFlowItemRuleGroup(expandFormData.ruleGroupList, nextFlowId, tempFlowUuid);
                                let name = this.getExpandFlowItemName(preFlow, tempFlowUuid);
                                this.createFlowItemLabel(preFlowId, tempFlowUuid, name);
                                this.$_plumbRepaintEverything();
                            }
                        });
                    });
                } else {
                    this.handleAddBetweenCommonFlowItem(options);
                }
            },

            // add between flow item
            handleAddBetweenCommonFlowItem(opts) {
                let {flowItemType, preFlowId, nextFlowId, formData} = opts;
                // update flow position
                let prevFlowItem = this.getFlow(preFlowId);
                let nextFlowItem = this.getFlow(nextFlowId);

                let options = {};
                // use next flow item's left
                if (this.isHasMoreNextFlowItemByType(prevFlowItem.type)) {
                    options.left = nextFlowItem.left;
                }
                //
                let flowItemUuid = this.createFlowItem(flowItemType, preFlowId, options);
                //
                let flowItem = this.getFlow(flowItemUuid);
                flowItem.formData = formData;
                flowItem.next.push(nextFlowId);
                //
                this.$nextTick(() => {
                    if (this.isExpandFlowItem(prevFlowItem.type)) {
                        // update expandFlowItem
                        this.updateExpandFlowItemRuleGroup(prevFlowItem.formData.ruleGroupList, nextFlowId, flowItemUuid);
                        this.updateBetweenFlowItem(flowItemUuid, nextFlowId, preFlowId);
                        let name = this.getExpandFlowItemName(prevFlowItem, flowItemUuid);
                        this.createFlowItemLabel(preFlowId, flowItemUuid, name);
                    } else {
                        this.updateBetweenFlowItem(flowItemUuid, nextFlowId, preFlowId);
                        if (this.isIfFlowItem(prevFlowItem.type)) {
                            this.createFlowItemLabel(preFlowId, flowItemUuid, options.offsetLeft > 0 ? '是' : '否`');
                        }
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

            updateExpandFlowItemRuleGroup(ruleGroupList, oldFlowUuid, newFlowUuid) {
                let ruleGroupItem = _.find(ruleGroupList, (groupItem) => {
                    return groupItem.nextStep === oldFlowUuid;
                });

                if (ruleGroupItem) {
                    ruleGroupItem.nextStep = newFlowUuid;
                }
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
                    preFlowItem.next.splice(preNextIndex, 1);
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
                this.$_plumbRepaintEverything();
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
            addTempFlowItem(preUuid, options) {
                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, options);
                this.draggableFlowConnect(preUuid, tempFlowUuid);
                return tempFlowUuid;
            },

            //
            addIfTempFlowItem(preUuid) {
                this.addIfOneTempFlowItem(preUuid, true);
                this.addIfOneTempFlowItem(preUuid, false);
            },

            addIfOneTempFlowItem(preUuid, isIf) {
                let preTempItem = this.getFlow(preUuid);
                let leftPosition = isIf ? -FLOW_LEFT_STEP_LENGTH : FLOW_LEFT_STEP_LENGTH;
                let tempFlowUuid = this.createFlowItem(FLOW_ITEM_TYPE.tempNode, preUuid, {offsetLeft: leftPosition});
                this.draggableFlowConnect(preUuid, tempFlowUuid);
                this.createFlowItemLabel(preUuid, tempFlowUuid, isIf ? '是' : '否');
                if (isIf) {
                    preTempItem.nextIfId = tempFlowUuid;
                } else {
                    preTempItem.nextElseId = tempFlowUuid;
                }
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
                    //update ruleGroupsItem
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
                let firstTime = target.dataset.firstTime;
                let lastTime = new Date().getTime();
                let left = ('' + target.style.left).replace('px', '');
                let top = ('' + target.style.top).replace('px', '');
                const _isClick = lastTime - firstTime < 200;
                if (!_isClick) {
                    this.$_updateMemoryList();
                }

                flowItem.left = Number(left);
                flowItem.top = Number(top);
                target.dataset.isClick = _isClick;
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
                    this.$_updateMemoryList();
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
                result.positions = JSON.stringify(positionObj);
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
                this.$_updatePosition();
            },

            handleClear() {
                this.$confirm('确定要清空数据,重做吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$_doClear(true);
                }).catch(() => {

                });
            },

            handleUndo() {
                if (!this.canUndo) {
                    return;
                }

                if (MEMORY_LIST.length > 0) {
                    const tempItem = MEMORY_LIST.pop();
                    this.$_doClear();
                    this.$options.jsPlumb.reset();
                    this.$nextTick(() => {
                        this.updateFlow(tempItem, this.$_plumbRepaintEverything);
                    })
                }

                this.$_updateCanUndoBtn();
            },

            $_updatePosition() {
                const startNode = _.find(this.flowList, (flowItem) => {
                    return this.isStartFlowItem(flowItem);
                });

                if (startNode) {
                    this.$_updatePositionItemAndNext(startNode);
                    this.$_updatePositionExpandList();
                    this.$_plumbRepaintEverything();
                }
            },

            // update position item and next
            $_updatePositionItemAndNext(flowItem) {
                if (this.isStartFlowItem(flowItem)) {
                    flowItem.top = FLOW_START_STEP_TOP;
                    flowItem.left = this.getFlowItemInitLeft();
                } else {
                    const preFlowItem = this.getFlow(flowItem.prev[0]);
                    // pre flow item
                    if (preFlowItem) {
                        // top
                        flowItem.top = preFlowItem.top + FLOW_STEP_LENGTH;
                        if (this.isIfFlowItem(preFlowItem.type)) {
                            if (flowItem.uuid === preFlowItem.nextIfId) {
                                flowItem.left = preFlowItem.left - FLOW_LEFT_STEP_LENGTH;
                                if (this.isIfFlowItem(flowItem.type)) {
                                    flowItem.left -= FLOW_IF_OFFSET_LENGTH;
                                }
                            } else {
                                flowItem.left = preFlowItem.left + FLOW_LEFT_STEP_LENGTH;
                                if (this.isIfFlowItem(flowItem.type)) {
                                    flowItem.left += FLOW_IF_OFFSET_LENGTH;
                                }
                            }
                        } else if (this.isExpandFlowItem(preFlowItem.type)) {
                            // todo 待完成。
                        } else {
                            // use pre left
                            flowItem.left = preFlowItem.left;
                        }

                    }
                }

                flowItem.next.forEach((uuid) => {
                    const _flowItem = this.getFlow(uuid);
                    if (_flowItem) {
                        this.$_updatePositionItemAndNext(_flowItem);
                    }
                })
            },

            // update position expand and next
            // todo
            $_updatePositionExpandList() {
                const expandList = this.flowList.filter((flowItem) => {
                    return this.isExpandFlowItem(flowItem.type);
                });

                if (expandList.length > 0) {
                    // down -> up
                    for (let i = expandList.length; i >= 0; i--) {
                        const expandFlowItem = expandList[i];
                        expandFlowItem.next.forEach((expandFlowItemChild) => {

                        })
                    }
                }
            },

            //
            $_getNextFlowItemRect(flowItem) {
                let result = {
                    left: 0,
                    right: 0,
                    width: 0
                };
                //
                flowItem.next.forEach((flowItemUuid) => {
                    const tempItem = this.getFlow(flowItemUuid);
                    if (!result.left && !result.right) {
                        result.left = tempItem.left;
                        result.right = tempItem.right;
                    } else {
                        if (result.left >= tempItem.left) {
                            result.left = tempItem.left;
                        } else if (result.right <= tempItem.left) {
                            result.right = tempItem.left;
                        }
                    }

                    if (tempItem.next && tempItem.next.length > 0) {
                        let nextPosition = this.$_getNextFlowItemRect(tempItem);
                        if (result.left >= nextPosition.left) {
                            result.left = nextPosition.left;
                        }
                        if (result.right <= nextPosition.left) {
                            result.right = nextPosition.left;
                        }
                    }
                });

                result.width = result.right - result.left;

                return result;
            },


            $_doClear(needInit) {
                const startNode = _.find(this.flowList, (flowItem) => {
                    return this.isStartFlowItem(flowItem);
                });

                if (startNode) {
                    this.deleteNextFlowItem(startNode.uuid);
                    if (needInit) {
                        this.$nextTick(() => {
                            this.initFlow();
                        })
                    }

                }
            },

            handleGetData() {
                const formData = this.formatData();
                const formatter = new JSONFormatter(formData, 3);
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.preShow.appendChild(formatter.render());
                })
            },

            getFlowItemFormData(item) {
                let result = clone(item);

                delete result.elementId;
                delete result.stepId;

                if (result.nextStep) {
                    delete result.nextStep;
                }

                if (result.nextSteps) {
                    delete result.nextSteps;
                }

                return result;
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

            isTempFlowItem(flowItem) {
                return flowItem.type === FLOW_ITEM_TYPE.tempNode;
            },

            isStartFlowItem(flowItem) {
                return flowItem.type === FLOW_ITEM_TYPE.startNode;
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

            //
            isHasMoreNextFlowItem(flowItem) {
                return this.isHasMoreNextFlowItemByType(flowItem.type);
            },
            isHasMoreNextFlowItemByType(flowItemType) {
                return this.isIfFlowItem(flowItemType) || this.isExpandFlowItem(flowItemType);
            },

            //
            isHasStepCountFlowItem(flowItem) {
                return flowItem.groupType === FLOW_TYPE.action || flowItem.type === FLOW_ITEM_TYPE.startNode;
            }
        }
    }
</script>

<style lang="sass">
    @import "../styles/workflow.scss"
</style>
