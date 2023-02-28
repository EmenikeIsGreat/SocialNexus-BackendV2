/*
SPDX-License-Identifier: Apache-2.0
*/
/*
Based on: https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-basic/chaincode-go
*/

package main

import (
	"log"
	chaincode "socialnexus_contract/chaincode"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
	assetChaincode, err := contractapi.NewChaincode(&chaincode.SmartContract{})
	if err != nil {
		log.Panicf("Error creating asset-transfer-basic chaincode: %v", err)
	}

	if err := assetChaincode.Start(); err != nil {
		log.Panicf("Error starting asset-transfer-basic chaincode: %v", err)
	}
}
