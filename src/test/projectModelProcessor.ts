import ProjectModelProcessor, {
  ProcessEnv,
  ProcessEnvTicketData,
  ProcessEnvTicketHistory,
} from '../ProjectModelProcessor'
import testModel from '../scripts/model/models/test'
import originv1Model from '../scripts/model/models/originv1'
import { expect } from 'chai'

describe('ProjectModelProcessor', function () {
  it('test model', function () {
    const processor = new ProjectModelProcessor(testModel)
    const mockEnv: ProcessEnv = {
      args: {},
      block: {
        hash: '',
        height: 0,
      },
      transaction: {
        hash: '',
      },
      history: new ProcessEnvTicketHistory([]),
    }
    // 2
    const test1 = { a: '1', b: 'true', c: '1' }
    const result1 = processor.process({
      ...mockEnv,
      args: test1,
    })
    expect(result1).to.equal(2n)
    // 3
    const test2 = { a: '1', b: 'false', c: '1' }
    const result2 = processor.process({
      ...mockEnv,
      args: test2,
    })
    expect(result2).to.equal(3n)
    // 13
    const test3 = { a: '1', b: 'false', c: 'test' }
    const result3 = processor.process({
      ...mockEnv,
      args: test3,
    })
    expect(result3).to.equal(13n)
  })

  function getOriginv1MockEnv(env: ProcessEnv): ProcessEnv {
    const self: ProcessEnvTicketData = {
      state: 'processing',
      projectId: 1,
      address: '0xa',
      transactionHash: env.transaction.hash,
      blockHash: env.block.hash,
      blockHeight: env.block.height,
      blockTimestamp: 1,
      modelId: 1,
    }
    const originv1MockEnv: ProcessEnv = {
      ...env,
      args: {
        base: '100',
        cd: '30',
        X: '5',
        a1: '19',
        a2: '32',
        a3: '0',
        a4: '0',
        a5: '0',
        a6: '48',
        a7: '0',
        a8: '0',
        a9: '0',
        a10: '0',
      },
      history: new ProcessEnvTicketHistory([self, ...env.history]),
    }
    return originv1MockEnv
  }

  it('originv1: normal', function () {
    const processor = new ProjectModelProcessor(originv1Model)
    // base * a * ap * diff * X / cd
    // 100  * 1 * 19 * 30   * 5 / 30 = 9500
    const mockEnv = getOriginv1MockEnv({
      args: {},
      block: {
        // 6
        hash: '0x1e362b1963210c355d1e316d702f1fd219ae474e0cf82aecbd4d4d1010fc70f9',
        height: 1,
      },
      transaction: {
        // 7
        hash: '0x1a17c8fcfe47f3472d7421760511431ffe9a238d6dc392688e160ba0e261e9be',
      },
      history: new ProcessEnvTicketHistory([]),
    })
    const result = processor.process(mockEnv)
    expect(result).to.equal(9500n)
  })

  it('originv1: no reward', function () {
    const processor = new ProjectModelProcessor(originv1Model)
    // base * a  * ap * diff * X / cd
    // 100  * 10 * 0  * 30   * 5 / 30 = 0
    const mockEnv = getOriginv1MockEnv({
      args: {},
      block: {
        // 6
        hash: '0x1e362b1963210c355d1e316d702f1fd219ae474e0cf82aecbd4d4d1010fc70f9',
        height: 1,
      },
      transaction: {
        // 6
        hash: '0x1a17c8fcfe47f3472d7421760511431ffe9a238d6dc392688e160ba0e261e8be',
      },
      history: new ProcessEnvTicketHistory([]),
    })
    const result = processor.process(mockEnv)
    expect(result).to.equal(0n)
  })

  it('originv1: has history', function () {
    const processor = new ProjectModelProcessor(originv1Model)
    // base * a * ap * diff * X / cd
    // 100  * 1 * 19 * 6    * 5 / 30 = 1900
    const mockEnv = getOriginv1MockEnv({
      args: {},
      block: {
        // 6
        hash: '0x1e362b1963210c355d1e316d702f1fd219ae474e0cf82aecbd4d4d1010fc70f9',
        height: 30,
      },
      transaction: {
        // 7
        hash: '0x1a17c8fcfe47f3472d7421760511431ffe9a238d6dc392688e160ba0e261e9be',
      },
      history: new ProcessEnvTicketHistory([
        {
          state: 'processed',
          projectId: 1,
          address: '',
          transactionHash: '',
          blockHash: '',
          blockHeight: 24,
          blockTimestamp: 1,
          modelId: 1,
        },
      ]),
    })
    const result = processor.process(mockEnv)
    expect(result).to.equal(1900n)
  })
})
