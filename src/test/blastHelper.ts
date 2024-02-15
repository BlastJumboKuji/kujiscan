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
})
