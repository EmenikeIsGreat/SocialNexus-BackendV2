const query = require('../../Blockchain/wrappedFabConnect/query')
const tx = require('../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');



test('createAsset getAsset verfying name',async ()=>{
    await tx('CreateAsset',["sample","Emenike"],true)
    const res = (await query('GetAsset',["sample"],true)).result.name
    expect(
        res
    ).toBe("sample")
})

test('userBid',async ()=>{
    await tx('CreateAsset',["Nike","Emenike"],true)
    
    await tx('createUser',["Emenike"],true)
    await tx('createUser',["Arinze"],true)

    await tx("Deposit",["sample1","Emenike","1000"],true)    
    await tx("Deposit",["sample1","Arinze","1000"],true)
    
    let order = [{
        orderID:"order1",
        userID:"Emenike",
        assetID:"Nike",
        usdsn:100
    },
    {
        orderID:"order2",
        userID:"Arinze",
        assetID:"Nike",
        usdsn:100
    }]

    await tx('UserBid',["Nike",stringify(order)],true)



    const asset = (await query('GetAsset',["Nike"],true)).result
    const amountRaised = asset.amountRaised

    const tx1 = (await query('GetTxID',["order1"],true)).result
    const tx2 = (await query('GetTxID',["order2"],true)).result

    const balance1 = (await query('GetBalance',["Emenike"],true)).result
    const balance2 = (await query('GetBalance',["Arinze"],true)).result
    

    const res = {
        balance1:balance1,
        balance2:balance2,
        amountRaised: amountRaised,
        tx1:tx1.valid,
        tx2:tx2.valid,
        biddersAmount1:asset.bidders.Arinze.amount,
        biddersAmount2:asset.bidders.Emenike.amount

    }
    console.log(res)
    expect(
        res
    ).toEqual({
        balance1:900,
        balance2:900,
        amountRaised:200,
        tx1:true,
        tx2:true,
        biddersAmount1:100,
        biddersAmount2:100
    })
})
