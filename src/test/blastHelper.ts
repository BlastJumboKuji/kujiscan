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
      fromBlock: 1957367,
      toBlock: 1957369,
      address: '0x25fF31959f85de4b59F188BD223456ae45F1032A',
    })
    expect(logs.length).gt(0)
  })
})
