const query = require('../../Blockchain/wrappedFabConnect/query')
const tx = require('../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');


test("testing",
async()=>{
    //let val = (await tx("Deposit",["sample","Emenike","10"]))
    await tx('createUser',["Emenike"],true)
    await tx('Deposit',["sample","Emenike","1000"],true)
    
    res3 = (await query('GetBalance',["Emenike"],true)).result
    expect(
        res3
    ).toBe(
        1000
    )
})


test("testing withdraw without fees",
async()=>{

    await tx('SetTransferFee',["0"],true) 


    await tx('createUser',["Emenike"],true)
    await tx('Deposit',["sample","Emenike","100"],true)
    
    // let balance = (await query('GetBalance',["Emenike"])).result
    // console.log(balance)

    await tx('Withdraw',["sample","Emenike","10"],true)
    
    balance = (await query('GetBalance',["Emenike"],true)).result
//     console.log(balance)
    expect(
        balance
    ).toBe(
        90
    )
})

test("withdraw with fees, SocialNexus revnue, revenue collect",
async()=>{
    await tx('SetTransferFee',["0.03"],true)
    await tx('createUser',["Emenike"],true)
    let val = (await tx("Deposit",["sample","Emenike","10000"],true))
    let res = await tx('Withdraw',["sample","Emenike","100"],true)

    await tx('createUser',["Arinze"],true)
    let val2 = (await tx("Deposit",["sample","Arinze","10000"],true))
    let res3 = await tx('Withdraw',["sample","Arinze","100"],true)
    
    let balance = (await query('GetBalance',["Emenike"],true)).result
    let revenue = (await query('GetRevenue',[],true)).result
    await tx('CollectRevenue',[],true)
    let revenue2 = (await query('GetRevenue',[],true)).result

    expect(
        [balance,revenue,revenue2]
    ).toEqual(
        [9897,6,0]
    )
})



test("testing withdraw with not enough balance",
async()=>{
    await tx('SetTransferFee',["0.01"],true)
    await tx('createUser',["Emenike"],true)
    let val = (await tx("Deposit",["sample","Emenike","10000"],true))
    let res = await tx('Withdraw',["sample","Emenike","1000000000"],true)
    
    let balance = (await query('GetBalance',["Emenike"],true)).result
    expect(
        balance
    ).toBe(
        10000
    )
})

test("testing if Deposit Transaction is saved",
async()=>{
    await tx('createUser',["Emenike"],true)
    let res1 = await tx("Deposit",["sample1","Emenike","10000"],true)
    
    let tx1 = (await query('GetTxID',["sample1"],true)).result

    let tx1JSON = stringify(tx1)
    let comparison1 = {
        valid:true,
        code:0
    }


    let correcrt = stringify(comparison1) == tx1JSON
    expect(
        correcrt

    ).toBe(
        true
    )
})


test("testing if Deposit Transaction is saved",
async()=>{
    await tx('createUser',["Emenike"],true)

    let res2 = await tx('Withdraw',["sample2","Emenike","1000000000"],true)
    
    let tx2 = (await query('GetTxID',["sample2"],true)).result

    let t2JSON = stringify(tx2)

    let comparison2 = {
        valid:false,
        code:1
    }
    let correcrt = t2JSON == stringify(comparison2)
    expect(
        correcrt

    ).toBe(
        true
    )
})

