const query = require('../../Blockchain/wrappedFabConnect/query')
const tx = require('../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');



test('testing set reserves and get reserves',async ()=>{
    await tx('SetReserves',["10"])
    const res = (await query('GetReserves',[])).result
    expect(
        res
    ).toBe(10)
})

test('testing set fees and get fees',async ()=>{
    await tx('setOrderFee',["10"])
    await tx('SetTransferFee',["11"])
    await tx('SetCreatorFee',["12"])
    await tx('SetLPFee',["13"])

    const res = (await query('GetFees',[])).result
    console.log(res)
    const comapareRes = {
        "LPFees": 13,
        "creatorFee": 12,
        "orderFee": 10,
        "transferFee": 11
      }

    const valid = stringify(res) == stringify(comapareRes)
    expect(
        valid
    ).toBe(true)
})











