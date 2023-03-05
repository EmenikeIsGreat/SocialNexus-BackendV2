package chaincode

type User struct {
	Id     string             `json:"id"`
	Assets map[string]Balance `json:"assets"`
}

type Balance struct {
	Balance float64 `json:"balance"`
	Bid     float64 `json:"bid"`
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

type LiquidityProviders struct {
	Name      string               `json:"name"`
	Providers map[string]LPBalance `json:"providers"`
}

type LPBalance struct {
	USDSH float64 `json:"usdsh"`
	Asset float64 `json:"asset"`
}

type Fees struct {
	OrderFee    float64 `json:"orderFee"`
	TransferFee float64 `json:"transferFee"`
	CreatorFee  float64 `json:"creatorFee"`
	LPFees      float64 `json:"LPFees"`
}

/*
0 is success
1 is insufficient balance
2 not enough of asset
3 not within slippage
*/
type Tx struct {
	Valid bool `json:"valid"`
	Code  int  `json:"code"`
}

type Order struct {
	OrderId string  `json:"orderID"`
	UserID  string  `json:"userID"`
	AssetID string  `json:"assetID"`
	Usdsn   float64 `json:"usdsn"`
}
