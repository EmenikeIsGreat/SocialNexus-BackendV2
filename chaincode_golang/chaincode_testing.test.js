const query = require('../Blockchain/wrappedFabConnect/query')
const tx = require('../Blockchain/wrappedFabConnect/transactions')



// testing if name is right
test('testing createUser and getUser and verifying name',async ()=>{
    tx('createUser',["Emenike"])
    const res = (await query('getUser',["Emenike"])).result.id
    expect(
        res
    ).toBe("Emenike")
})

// testing if balance is zero after creation
test('testing createUser and getUser and verifying balance',async ()=>{
    tx('createUser',["Emenike"])
    const res = (await query('getUser',["Emenike"])).result.assets.USDSH.balance
    expect(
        res
    ).toBe(0)
})



test('testing createAsset and getAsset and verfying name',async ()=>{
    tx('createAsset',["sample","Emenike"])
    const res = (await query('getAsset',["sample"])).result.name
    expect(
        res
    ).toBe("sample")
})







