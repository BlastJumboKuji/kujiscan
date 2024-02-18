import EVMHelper from '../utils/EVMHelper'
import { SupportedEVMHelperChains } from '../utils/EVMHelper/types'
import { expect } from 'chai'

describe('BlastHelper', function () {
  it('connect', async function () {
    const helper = new EVMHelper(SupportedEVMHelperChains.blastSepoliaTestnet)
    const provider = await helper.getRpcProvider()
    const blockNumber = await provider.getBlockNumber()
    expect(blockNumber).gt(0)
  })

  it('get contract event logs', async function () {
    const helper = new EVMHelper(SupportedEVMHelperChains.blastSepoliaTestnet)
    const provider = await helper.getRpcProvider()
    const logs = await provider.getLogs({
      fromBlock: 1695841,
      toBlock: 1695851,
    })
    expect(logs.length).gt(0)
  })
})
