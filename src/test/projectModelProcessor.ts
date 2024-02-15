import ProjectModelProcessor from '../db/models/Project/ProjectModelProcessor'
import testModel from '../scripts/model/models/test'
import { expect } from 'chai'

describe('ProjectModelProcessor', function () {
  it('test model', function () {
    const processor = new ProjectModelProcessor(testModel)
    // 2
    const test1 = { a: '1', b: 'true', c: '1' }
    const result1 = processor.process(test1)
    expect(result1).to.equal(2n)
    // 3
    const test2 = { a: '1', b: 'false', c: '1' }
    const result2 = processor.process(test2)
    expect(result2).to.equal(3n)
    // 13
    const test3 = { a: '1', b: 'false', c: 'test' }
    const result3 = processor.process(test3)
    expect(result3).to.equal(13n)
  })
})
