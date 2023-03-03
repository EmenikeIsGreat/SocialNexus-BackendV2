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
    await tx("Deposit",["sample1","Emenike","10000"],true)

    await tx('createUser',["Arinze"])
    await tx("Deposit",["sample1","Arinze","10000"],true)
    
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
    // await tx('CheckIfParsingWork',[stringify(order)])

    const res1 = (await query('GetUser',["Emenike"],true)).result
    const res2 = (await query('GetAsset',["Nike"],true)).result
    const res3 = (await query('GetTxID',["order1"],true)).result

    console.log(res1)
    console.log(res2)
    console.log(res3)
    expect(
        res3
    ).toBe("sample")
})
