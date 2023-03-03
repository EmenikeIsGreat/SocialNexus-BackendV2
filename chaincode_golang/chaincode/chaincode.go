/*

function names must be capatalized or it wont work lol

also struct values must have a capital letter first also lol

*/

package chaincode

import (
	"encoding/json"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// function names are case sensitve make them upperCase
type SmartContract struct {
	contractapi.Contract
}

// type User struct {
// 	Id     string             `json:"id"`
// 	Assets map[string]Balance `json:"assets"`
// }

// type Balance struct {
// 	Balance float64 `json:"balance"`
// }

// type Asset struct {
// 	Name         string            `json:"name"`
// 	Creator      string            `json:"creator"`
// 	AmountRaised float64           `json:"amountRaised"`
// 	Fees         float64           `json:"fees"`
// 	Bidders      map[string]Bidder `json:"bidders"`
// 	Reserves     float64           `json:"reserves"`
// }

// type Bidder struct {
// 	Id     string  `json:"id"`
// 	Amount float64 `json:"amount"`
// }

// type LiquidityProviders struct {
// 	Name      string               `json:"name"`
// 	Providers map[string]LPBalance `json:"providers"`
// }

// type LPBalance struct {
// 	USDSH float64 `json:"usdsh"`
// 	Asset float64 `json:"asset"`
// }

// type Fees struct {
// 	OrderFee    float64 `json:"orderFee"`
// 	TransferFee float64 `json:"transferFee"`
// 	CreatorFee  float64 `json:"creatorFee"`
// 	LPFees      float64 `json:"LPFees"`
// }

// /*
// 0 is success
// 1 is insufficient balance
// 2 not enough of asset
// 3 not within slippage
// */
// type Tx struct {
// 	Valid bool `json:"valid"`
// 	Code  int  `json:"code"`
// }

// type Order struct {
// 	OrderId string  `json:"orderID"`
// 	UserID  string  `json:"userID"`
// 	AssetID string  `json:"assetID"`
// 	Usdsn   float64 `json:"usdsn"`
// }

var orderFee float64 = 0
var transferFee float64 = 0
var creatorFee float64 = 0
var LPFees float64 = 0
var revenue float64 = 0

var reserves float64 = 0

func (s *SmartContract) SetReserves(amount string) {

	reserves, _ = strconv.ParseFloat(amount, 64)
}

func (s *SmartContract) GetReserves() float64 {
	return reserves
}

func (s *SmartContract) GetFees() Fees {
	fees := Fees{
		OrderFee:    orderFee,
		TransferFee: transferFee,
		CreatorFee:  creatorFee,
		LPFees:      LPFees,
	}

	return fees
}

func (s *SmartContract) SetOrderFee(amount string) {

	orderFee, _ = strconv.ParseFloat(amount, 64)
}

func (s *SmartContract) SetTransferFee(amount string) {

	transferFee, _ = strconv.ParseFloat(amount, 64)
}

func (s *SmartContract) SetCreatorFee(amount string) {

	creatorFee, _ = strconv.ParseFloat(amount, 64)
}

func (s *SmartContract) SetLPFee(amount string) {

	LPFees, _ = strconv.ParseFloat(amount, 64)
}

func (s *SmartContract) GetRevenue() float64 {
	return revenue
}

func (s *SmartContract) CollectRevenue() {
	revenue = 0
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
func (*SmartContract) Deposit(ctx contractapi.TransactionContextInterface, txID string, id string, amountString string) {

	amount, _ := strconv.ParseFloat(amountString, 64)
	userJSONBytes, _ := ctx.GetStub().GetState(id)

	var user User
	json.Unmarshal(userJSONBytes, &user)

	value, _ := user.Assets["USDSH"]

	value.Balance += amount
	user.Assets["USDSH"] = value

	res, _ := json.Marshal(user)

	ctx.GetStub().PutState(id, res)

	tx := Tx{
		Valid: true,
		Code:  0,
	}

	txJSOn, _ := json.Marshal(tx)
	ctx.GetStub().PutState(txID, txJSOn)

}

func (*SmartContract) Withdraw(ctx contractapi.TransactionContextInterface, txID string, id string, amountString string) {

	amount, _ := strconv.ParseFloat(amountString, 64)
	userJSONBytes, _ := ctx.GetStub().GetState(id)

	var user User
	json.Unmarshal(userJSONBytes, &user)

	tx := Tx{
		Valid: false,
		Code:  1,
	}

	if !HasBalance(user, amount+amount*(transferFee)) {

		res, _ := json.Marshal(tx)
		ctx.GetStub().PutState(txID, res)
		return
	}
	balance, _ := user.Assets["USDSH"]
	balance.Balance -= amount + amount*(transferFee)
	revenue += amount * (transferFee)
	user.Assets["USDSH"] = balance

	res, _ := json.Marshal(user)

	ctx.GetStub().PutState(id, res)
	tx.Valid = true
	tx.Code = 0

	txJSOn, _ := json.Marshal(tx)
	ctx.GetStub().PutState(txID, txJSOn)

}

func HasBalance(user User, amount float64) bool {
	balance, _ := user.Assets["USDSH"]

	if balance.Balance >= amount {
		return true
	}

	return false
}

func (*SmartContract) GetBalance(ctx contractapi.TransactionContextInterface, id string) float64 {

	var userByteData, _ = ctx.GetStub().GetState(id)
	var user User

	json.Unmarshal(userByteData, &user)

	value, _ := user.Assets["USDSH"]

	return value.Balance

}

func (*SmartContract) GetTxID(ctx contractapi.TransactionContextInterface, txID string) Tx {

	data, _ := ctx.GetStub().GetState(txID)

	var txJSON Tx
	json.Unmarshal(data, &txJSON)
	return txJSON
}

func (*SmartContract) CheckIfParsingWork(ctx contractapi.TransactionContextInterface, data string) {
	var data2 []Order

	json.Unmarshal([]byte(data), &data2)

	tx := Tx{
		Valid: true,
		Code:  int(data2[0].Usdsn),
	}

	txJSOn, _ := json.Marshal(tx)
	ctx.GetStub().PutState(data2[0].OrderId, txJSOn)

}

func (*SmartContract) UserBid(ctx contractapi.TransactionContextInterface, assetID string, stringOrders string) {
	var orders []Order
	var asset Asset

	assetBytes, _ := ctx.GetStub().GetState(assetID)
	json.Unmarshal(assetBytes, &asset)

	json.Unmarshal([]byte(stringOrders), &orders)

	for i := 0; i < len(orders); i++ {

		userID := orders[i].UserID
		assetID := orders[i].AssetID
		usdsn := orders[i].Usdsn
		var txID = orders[i].OrderId

		data, _ := ctx.GetStub().GetState(userID)
		var user User

		amount := user.Assets["USDSN"]

		json.Unmarshal(data, &user)

		fee := usdsn * orderFee
		totalCost := fee + usdsn
		reserves += fee

		if !HasBalance(user, totalCost) {
			tx := Tx{
				Valid: false,
				Code:  int(amount.Balance),
			}
			res, _ := json.Marshal(tx)
			ctx.GetStub().PutState(txID, res)
			return
		}

		balance := user.Assets[assetID]
		balance.Balance -= totalCost
		user.Assets[assetID] = balance

		asset.AmountRaised += usdsn
		bidders := asset.Bidders

		val, ok := bidders[userID]

		if !ok {
			val = Bidder{
				Id:     userID,
				Amount: usdsn,
			}
		} else {
			val.Amount += usdsn
		}

		bidders[userID] = val
		asset.Bidders = bidders

		userBytes, _ := json.Marshal(user)
		ctx.GetStub().PutState(userID, userBytes)

	}

	assetBytes, _ = json.Marshal(asset)
	ctx.GetStub().PutState(assetID, assetBytes)
}
