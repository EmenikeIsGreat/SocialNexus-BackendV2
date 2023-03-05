const query = require('../../Blockchain/wrappedFabConnect/query')
const tx = require('../../Blockchain/wrappedFabConnect/transactions')
const stringify  = require('json-stringify-deterministic');



test('testing createUser and getUser and verifying name',async ()=>{
    tx('CreateUser',["Emenike"],true)
    const res = (await query('getUser',["Emenike"],true)).result.id
    expect(
        res
    ).toBe("Emenike")
})

// testing if balance is zero after creation
test('testing createUser and getUser and verifying balance',async ()=>{
    tx('CreateUser',["Emenike"],true)
    const res = (await query('GetBalance',["Emenike"],true)).result
    expect(
        res
    ).toBe(0)
})



