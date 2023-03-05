const query = require('../../Blockchain/wrappedFabConnect/query')
const tx = require('../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');



test('testing set reserves and get reserves',async ()=>{
    await tx('SetReserves',["10"],true)
    const res = (await query('GetReserves',[],true)).result
    expect(
        res
    ).toBe(10)
})

test('testing set fees and get fees',async ()=>{
    await tx('SetOrderFee',["10"],true)
    await tx('SetTransferFee',["11"],true)
    await tx('SetCreatorFee',["12"],true)
    await tx('SetLPFee',["13"],true)

    const res = (await query('GetFees',[],true)).result
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











