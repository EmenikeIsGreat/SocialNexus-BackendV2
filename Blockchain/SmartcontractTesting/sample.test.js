const sample = require('./sample')
const sample2 = require('./sample2')

test('just testing',()=>{
    expect(
        sample()
    ).toBe(2)
})

test('just testing',()=>{
    expect(
        sample2()
    ).toBe(3)
})
