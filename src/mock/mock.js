export const workflowItem = {
    positions:'{"e164f7f0-340f-4710-8e9d-90e538f95dc6":{"left":801,"top":30},"7edf6f19-50ab-4047-aba0-bff0f1112450":{"left":801,"top":150},"b4d84bc0-e1d2-41c4-bd97-c1f3cfbbbc15":{"left":801,"top":270},"aecc8389-0339-4791-ba16-86793c782cee":{"left":721,"top":390},"811f5778-334c-4426-bc7c-012409f0d031":{"left":911,"top":390},"fae270c9-a657-4859-94f3-fba25cf962b6":{"left":721,"top":510},"cfc5cb7c-3fd6-412d-898b-57021d1eb9a0":{"left":831,"top":510},"11d00d99-5a70-437d-b420-ead16a827438":{"left":991,"top":510},"51df605d-2c4b-4ada-b1eb-5328f01d18b6":{"left":400,"top":630},"16c0f389-1734-47bb-a278-e29b4b56d73b":{"left":561,"top":630},"f4029f13-b39a-4046-ae72-200acfe1df08":{"left":881,"top":630},"5538cdd8-fe07-4a57-a1cb-377fdac351f8":{"left":1041,"top":630},"643dc8d8-a538-42bf-9255-84dc20336aca":{"left":320,"top":750},"fbf644dd-c308-4fdb-b9f0-07be8bd95f66":{"left":480,"top":750},"37f1aade-de62-4b4d-a29b-7a4d80d289a9":{"left":561,"top":750},"0e9788bf-62bc-4da3-a701-861752602a05":{"left":721,"top":630},"d7b35346-a3d6-4474-88d4-34262b303e64":{"left":721,"top":750},"0e19a6e0-6ae6-4534-a0fe-d279c24673ae":{"left":881,"top":750},"06251e27-5d20-4fb2-989b-bdf64e625ff3":{"left":961,"top":750},"6b0cfcd2-ffb2-42ae-83fb-8ae21a950fa0":{"left":1121,"top":750},"cde5693d-1083-450c-a037-65ef5973747c":{"left":961,"top":870},"0183559b-c2ee-48bf-a718-3b2721e45a29":{"left":1121,"top":870}}',
    steps: [
        {
            "elementId": "startNode",
            "stepId": "e164f7f0-340f-4710-8e9d-90e538f95dc6",
            "nextStep": "7edf6f19-50ab-4047-aba0-bff0f1112450"
        },
        {
            "elementId": "nodeNode",
            "stepId": "7edf6f19-50ab-4047-aba0-bff0f1112450",
            "nextStep": "b4d84bc0-e1d2-41c4-bd97-c1f3cfbbbc15",
            "stepName": "节点"
        },
        {
            "elementId": "conditionNode",
            "stepId": "b4d84bc0-e1d2-41c4-bd97-c1f3cfbbbc15",
            "nextSteps": [
                {
                    "nextStep": "aecc8389-0339-4791-ba16-86793c782cee",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "811f5778-334c-4426-bc7c-012409f0d031",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "nodeNode",
            "stepId": "aecc8389-0339-4791-ba16-86793c782cee",
            "nextStep": "fae270c9-a657-4859-94f3-fba25cf962b6",
            "stepName": "节点"
        },
        {
            "elementId": "conditionNode",
            "stepId": "811f5778-334c-4426-bc7c-012409f0d031",
            "nextSteps": [
                {
                    "nextStep": "cfc5cb7c-3fd6-412d-898b-57021d1eb9a0",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "11d00d99-5a70-437d-b420-ead16a827438",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "switchNode",
            "stepId": "fae270c9-a657-4859-94f3-fba25cf962b6",
            "nextSteps": [
                {
                    "nextStep": "51df605d-2c4b-4ada-b1eb-5328f01d18b6",
                    "name": "1",
                    "isDefault": false
                },
                {
                    "nextStep": "16c0f389-1734-47bb-a278-e29b4b56d73b",
                    "name": "2",
                    "isDefault": false
                },
                {
                    "nextStep": "0e9788bf-62bc-4da3-a701-861752602a05",
                    "name": "3",
                    "isDefault": false
                },
                {
                    "nextStep": "f4029f13-b39a-4046-ae72-200acfe1df08",
                    "name": "4",
                    "isDefault": false
                },
                {
                    "nextStep": "5538cdd8-fe07-4a57-a1cb-377fdac351f8",
                    "name": "5",
                    "isDefault": false
                }
            ],
            "stepName": "条件分组"
        },
        {
            "elementId": "stopNode",
            "stepId": "cfc5cb7c-3fd6-412d-898b-57021d1eb9a0",
            "nextStep": null
        },
        {
            "elementId": "stopNode",
            "stepId": "11d00d99-5a70-437d-b420-ead16a827438",
            "nextStep": null
        },
        {
            "elementId": "conditionNode",
            "stepId": "51df605d-2c4b-4ada-b1eb-5328f01d18b6",
            "nextSteps": [
                {
                    "nextStep": "643dc8d8-a538-42bf-9255-84dc20336aca",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "fbf644dd-c308-4fdb-b9f0-07be8bd95f66",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "nodeNode",
            "stepId": "16c0f389-1734-47bb-a278-e29b4b56d73b",
            "nextStep": "37f1aade-de62-4b4d-a29b-7a4d80d289a9",
            "stepName": "节点"
        },
        {
            "elementId": "nodeNode",
            "stepId": "f4029f13-b39a-4046-ae72-200acfe1df08",
            "nextStep": "0e19a6e0-6ae6-4534-a0fe-d279c24673ae",
            "stepName": "节点"
        },
        {
            "elementId": "conditionNode",
            "stepId": "5538cdd8-fe07-4a57-a1cb-377fdac351f8",
            "nextSteps": [
                {
                    "nextStep": "06251e27-5d20-4fb2-989b-bdf64e625ff3",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "6b0cfcd2-ffb2-42ae-83fb-8ae21a950fa0",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "stopNode",
            "stepId": "643dc8d8-a538-42bf-9255-84dc20336aca",
            "nextStep": null
        },
        {
            "elementId": "stopNode",
            "stepId": "fbf644dd-c308-4fdb-b9f0-07be8bd95f66",
            "nextStep": null
        },
        {
            "elementId": "stopNode",
            "stepId": "37f1aade-de62-4b4d-a29b-7a4d80d289a9",
            "nextStep": null
        },
        {
            "elementId": "nodeNode",
            "stepId": "0e9788bf-62bc-4da3-a701-861752602a05",
            "nextStep": "d7b35346-a3d6-4474-88d4-34262b303e64",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "d7b35346-a3d6-4474-88d4-34262b303e64",
            "nextStep": null
        },
        {
            "elementId": "stopNode",
            "stepId": "0e19a6e0-6ae6-4534-a0fe-d279c24673ae",
            "nextStep": null
        },
        {
            "elementId": "nodeNode",
            "stepId": "06251e27-5d20-4fb2-989b-bdf64e625ff3",
            "nextStep": "cde5693d-1083-450c-a037-65ef5973747c",
            "stepName": "节点"
        },
        {
            "elementId": "nodeNode",
            "stepId": "6b0cfcd2-ffb2-42ae-83fb-8ae21a950fa0",
            "nextStep": "0183559b-c2ee-48bf-a718-3b2721e45a29",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "cde5693d-1083-450c-a037-65ef5973747c",
            "nextStep": null
        },
        {
            "elementId": "stopNode",
            "stepId": "0183559b-c2ee-48bf-a718-3b2721e45a29",
            "nextStep": null
        }
    ]
};

export const workflowItem2 ={
    positions:'{"f4d316b7-b2d1-46bf-aeaa-42525c84726f":{"left":801,"top":30},"c89829f5-8595-458c-b040-4ff84d27befc":{"left":801,"top":150},"d611c32f-b6c0-4b97-80d9-47b783bd93ad":{"left":174,"top":270},"7bd4fc3d-c3b9-4b19-81dc-e49cd1e7b5c5":{"left":800,"top":271},"85c30556-75fa-441c-9a1d-0dced21755a5":{"left":1246,"top":261},"23220649-1dcd-4bdc-af43-a6f80800b80c":{"left":720,"top":391},"da100cd2-a2fd-4967-911f-3acb1036d249":{"left":880,"top":391},"4829e3d8-b45a-4719-abdb-518df7e383ea":{"left":1166,"top":381},"70712f8b-d164-4224-89fd-983a9a20f6b7":{"left":1326,"top":381},"9fa174ae-97b3-41b6-a9a5-9e6189561b85":{"left":720,"top":511},"996c2224-7ae3-43fe-ba3c-8b0c33f8a632":{"left":640,"top":631},"d2a791f1-7bd7-4cde-ab7c-2e8fab3bb869":{"left":800,"top":631},"d5ba66cb-7ddb-4dbc-ad44-fe27570cc90d":{"left":640,"top":751},"89bf2095-030f-4c5f-9d52-1f97cab2e295":{"left":720,"top":871},"83e1fce2-90d8-4edc-9d72-256e2e95425c":{"left":560,"top":871},"653742e5-ea18-4808-ae09-578a3b4667de":{"left":560,"top":991},"b8cb3a6f-4235-4b73-af09-3288f6bebe66":{"left":1166,"top":501},"43c74167-9906-454f-b3d4-4b0687c9cb94":{"left":1086,"top":621},"88e3aee3-d01c-432e-af05-d79d922c55df":{"left":1246,"top":621},"35a13fb1-916e-4717-9692-96a3262e5fd4":{"left":1086,"top":741},"d1c1e591-5b3e-4128-9609-080a30d8e414":{"left":1006,"top":861},"512f2bac-82ca-4ecc-8e71-a0171e8beb4a":{"left":1166,"top":861},"ccf0d71b-a81e-47f6-80f6-ec3dfb270f9c":{"left":1006,"top":981}}',
    steps:[
        {
            "elementId": "startNode",
            "stepId": "f4d316b7-b2d1-46bf-aeaa-42525c84726f",
            "nextStep": "c89829f5-8595-458c-b040-4ff84d27befc"
        },
        {
            "elementId": "switchNode",
            "stepId": "c89829f5-8595-458c-b040-4ff84d27befc",
            "nextSteps": [
                {
                    "nextStep": "d611c32f-b6c0-4b97-80d9-47b783bd93ad",
                    "name": "1",
                    "isDefault": false
                },
                {
                    "nextStep": "7bd4fc3d-c3b9-4b19-81dc-e49cd1e7b5c5",
                    "name": "2",
                    "isDefault": false
                },
                {
                    "nextStep": "85c30556-75fa-441c-9a1d-0dced21755a5",
                    "name": "3",
                    "isDefault": false
                }
            ],
            "stepName": "条件分组"
        },
        {
            "elementId": "stopNode",
            "stepId": "d611c32f-b6c0-4b97-80d9-47b783bd93ad",
            "nextStep": null
        },
        {
            "elementId": "conditionNode",
            "stepId": "7bd4fc3d-c3b9-4b19-81dc-e49cd1e7b5c5",
            "nextSteps": [
                {
                    "nextStep": "23220649-1dcd-4bdc-af43-a6f80800b80c",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "da100cd2-a2fd-4967-911f-3acb1036d249",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "conditionNode",
            "stepId": "85c30556-75fa-441c-9a1d-0dced21755a5",
            "nextSteps": [
                {
                    "nextStep": "4829e3d8-b45a-4719-abdb-518df7e383ea",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "70712f8b-d164-4224-89fd-983a9a20f6b7",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "nodeNode",
            "stepId": "23220649-1dcd-4bdc-af43-a6f80800b80c",
            "nextStep": "9fa174ae-97b3-41b6-a9a5-9e6189561b85",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "da100cd2-a2fd-4967-911f-3acb1036d249",
            "nextStep": null
        },
        {
            "elementId": "nodeNode",
            "stepId": "4829e3d8-b45a-4719-abdb-518df7e383ea",
            "nextStep": "b8cb3a6f-4235-4b73-af09-3288f6bebe66",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "70712f8b-d164-4224-89fd-983a9a20f6b7",
            "nextStep": null
        },
        {
            "elementId": "conditionNode",
            "stepId": "9fa174ae-97b3-41b6-a9a5-9e6189561b85",
            "nextSteps": [
                {
                    "nextStep": "996c2224-7ae3-43fe-ba3c-8b0c33f8a632",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "d2a791f1-7bd7-4cde-ab7c-2e8fab3bb869",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "nodeNode",
            "stepId": "996c2224-7ae3-43fe-ba3c-8b0c33f8a632",
            "nextStep": "d5ba66cb-7ddb-4dbc-ad44-fe27570cc90d",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "d2a791f1-7bd7-4cde-ab7c-2e8fab3bb869",
            "nextStep": null
        },
        {
            "elementId": "conditionNode",
            "stepId": "d5ba66cb-7ddb-4dbc-ad44-fe27570cc90d",
            "nextSteps": [
                {
                    "nextStep": "83e1fce2-90d8-4edc-9d72-256e2e95425c",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "89bf2095-030f-4c5f-9d52-1f97cab2e295",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "stopNode",
            "stepId": "89bf2095-030f-4c5f-9d52-1f97cab2e295",
            "nextStep": null
        },
        {
            "elementId": "nodeNode",
            "stepId": "83e1fce2-90d8-4edc-9d72-256e2e95425c",
            "nextStep": "653742e5-ea18-4808-ae09-578a3b4667de",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "653742e5-ea18-4808-ae09-578a3b4667de",
            "nextStep": null
        },
        {
            "elementId": "conditionNode",
            "stepId": "b8cb3a6f-4235-4b73-af09-3288f6bebe66",
            "nextSteps": [
                {
                    "nextStep": "43c74167-9906-454f-b3d4-4b0687c9cb94",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "88e3aee3-d01c-432e-af05-d79d922c55df",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "nodeNode",
            "stepId": "43c74167-9906-454f-b3d4-4b0687c9cb94",
            "nextStep": "35a13fb1-916e-4717-9692-96a3262e5fd4",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "88e3aee3-d01c-432e-af05-d79d922c55df",
            "nextStep": null
        },
        {
            "elementId": "conditionNode",
            "stepId": "35a13fb1-916e-4717-9692-96a3262e5fd4",
            "nextSteps": [
                {
                    "nextStep": "d1c1e591-5b3e-4128-9609-080a30d8e414",
                    "name": "是",
                    "isDefault": false,
                    "ruleGroups": []
                },
                {
                    "nextStep": "512f2bac-82ca-4ecc-8e71-a0171e8beb4a",
                    "name": "否",
                    "isDefault": true,
                    "ruleGroups": []
                }
            ],
            "stepName": "条件判断",
            "stepJson": "{}"
        },
        {
            "elementId": "nodeNode",
            "stepId": "d1c1e591-5b3e-4128-9609-080a30d8e414",
            "nextStep": "ccf0d71b-a81e-47f6-80f6-ec3dfb270f9c",
            "stepName": "节点"
        },
        {
            "elementId": "stopNode",
            "stepId": "512f2bac-82ca-4ecc-8e71-a0171e8beb4a",
            "nextStep": null
        },
        {
            "elementId": "stopNode",
            "stepId": "ccf0d71b-a81e-47f6-80f6-ec3dfb270f9c",
            "nextStep": null
        }
    ]
}