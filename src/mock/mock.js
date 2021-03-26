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
}