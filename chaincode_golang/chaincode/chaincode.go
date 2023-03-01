/*

function names must be capatalized or it wont work lol

also struct values must have a capital letter first


*/

package chaincode

import (
	"encoding/json"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// function names are case sensitve make them upperCase
type SmartContract struct {
	contractapi.Contract
}

type User struct {
	Id     string             `json:"id"`
	Assets map[string]Balance `json:"assets"`
}

type Balance struct {
	Balance float64 `json:"balance"`
}

type Asset struct {
	Name         string            `json:"name"`
	Creator      string            `json:"creator"`
	AmountRaised float64           `json:"amountRaised"`
	Fees         float64           `json:"fees"`
	Bidders      map[string]Bidder `json:"bidders"`
	Reserves     float64           `json:"reserves"`
}

type Bidder struct {
	Id     string  `json:"id"`
	Amount float64 `json:"amount"`
}

var reserves float64 = 0

func SetReserves(amount float64) {
	reserves = amount
}

func GetReserves() float64 {
	return reserves
}

func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, id string) {

	balance := make(map[string]Balance)

	balance["USDSH"] = Balance{
		Balance: 0,
	}

	user := User{
		Id:     id,
		Assets: balance,
	}
	userJSON, _ := json.Marshal(user)

	ctx.GetStub().PutState(id, userJSON)
}

func (s *SmartContract) GetUser(ctx contractapi.TransactionContextInterface, id string) User {
	userJSON, _ := ctx.GetStub().GetState(id)

	var user User
	json.Unmarshal(userJSON, &user)

	return user

}

func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, name string, creator string) {
	bidders := make(map[string]Bidder)

	asset := Asset{
		Name:         name,
		Creator:      creator,
		AmountRaised: 0,
		Fees:         0,
		Reserves:     reserves,
		Bidders:      bidders,
	}

	assetJSON, _ := json.Marshal(asset)

	ctx.GetStub().PutState(name, assetJSON)

}

func (s *SmartContract) GetAsset(ctx contractapi.TransactionContextInterface, name string) Asset {
	assetJSON, _ := ctx.GetStub().GetState(name)

	var asset Asset
	json.Unmarshal(assetJSON, &asset)

	return asset

}
