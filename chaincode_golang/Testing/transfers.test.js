const query = require('../../Blockchain/wrappedFabConnect/query')
const tx = require('../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');


test("testing",
async()=>{
    //let val = (await tx("Deposit",["sample","Emenike","10"]))
    await tx('createUser',["Emenike"])
    await tx('Deposit',["sample","Emenike","1000"])
    
    res3 = (await query('GetBalance',["Emenike"])).result
    expect(
        res3
    ).toBe(
        1000
    )
})


test("testing withdraw without fees",
async()=>{

    await tx('SetTransferFee',["0"]) 


    await tx('createUser',["Emenike"])
    await tx('Deposit',["sample","Emenike","100"])
    
    // let balance = (await query('GetBalance',["Emenike"])).result
    // console.log(balance)

    await tx('Withdraw',["sample","Emenike","10"])
    
    balance = (await query('GetBalance',["Emenike"])).result
//     console.log(balance)
    expect(
        balance
    ).toBe(
        90
    )
})

test("withdraw with fees, SocialNexus revnue, revenue collect",
async()=>{
    await tx('SetTransferFee',["0.03"])
    await tx('createUser',["Emenike"])
    let val = (await tx("Deposit",["sample","Emenike","10000"]))
    let res = await tx('Withdraw',["sample","Emenike","100"])

    await tx('createUser',["Arinze"])
    let val2 = (await tx("Deposit",["sample","Arinze","10000"]))
    let res3 = await tx('Withdraw',["sample","Arinze","100"])
    
    let balance = (await query('GetBalance',["Emenike"])).result
    let revenue = (await query('GetRevenue',[])).result
    await tx('CollectRevenue',[])
    let revenue2 = (await query('GetRevenue',[])).result
    
    expect(
        [balance,revenue,revenue2]
    ).toEqual(
        [9897,6,0]
    )
})



test("testing withdraw with not enough balance",
async()=>{
    await tx('SetTransferFee',["0.01"])
    await tx('createUser',["Emenike"])
    let val = (await tx("Deposit",["sample","Emenike","10000"]))
    let res = await tx('Withdraw',["sample","Emenike","1000000000"])
    
    let balance = (await query('GetBalance',["Emenike"])).result
    expect(
        balance
    ).toBe(
        10000
    )
})

test("testing if Deposit Transaction is saved",
async()=>{
    await tx('createUser',["Emenike"])
    let res1 = await tx("Deposit",["sample1","Emenike","10000"])
    
    let tx1 = (await query('GetTxID',["sample1"])).result

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
    await tx('createUser',["Emenike"])

    let res2 = await tx('Withdraw',["sample2","Emenike","1000000000"])
    
    let tx2 = (await query('GetTxID',["sample2"])).result

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

