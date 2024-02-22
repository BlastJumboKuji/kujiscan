import { JsonRpcProvider, Wallet } from 'ethers6'
import {
  ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR,
  ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK,
} from '../constants'
import KujiOriginv1Contract from '../contracts/KujiOriginv1'
import EVMHelper from '../utils/EVMHelper'
import { SupportedEVMHelperChains } from '../utils/EVMHelper/types'
import { expect } from 'chai'
import { tokenHumanAmount, tokenRealAmount } from '../utils'

const WETH_ADDR = '0x4200000000000000000000000000000000000023'
const REWARD_ADDR = WETH_ADDR
const { ORIGINV1_BLAST_TESTNET_TEST_WALLET_PK } = process.env

interface TestEnv {
  helper: EVMHelper
  owner: Wallet
  ownerContract: KujiOriginv1Contract
  userContract: KujiOriginv1Contract
  provider: JsonRpcProvider
}

async function getEnv(): Promise<TestEnv> {
  const helper = new EVMHelper(SupportedEVMHelperChains.blastSepoliaTestnet)
  const provider = await helper.getRpcProvider()
  const owner = await helper.getRandomProviderWallet(
    ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK!
  )

  const ownerContract = new KujiOriginv1Contract(
    ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR!,
    owner
  )

  const user = await helper.getRandomProviderWallet(
    ORIGINV1_BLAST_TESTNET_TEST_WALLET_PK!
  )
  const userContract = new KujiOriginv1Contract(
    ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR!,
    user
  )

  return {
    helper,
    owner,
    ownerContract,
    userContract,
    provider,
  }
}

describe('originv1', function () {
  beforeEach(async function () {
    expect(ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR?.length).gt(
      5,
      'check env ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR'
    )
    expect(ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK?.length).gt(
      5,
      'check env ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK'
    )
    expect(ORIGINV1_BLAST_TESTNET_TEST_WALLET_PK?.length).gt(
      5,
      'check env ORIGINV1_BLAST_TESTNET_TEST_WALLET_PK'
    )
  })

  it('props', async function () {
    const env = await getEnv()
    const props = await env.userContract.getFullProps()
    expect(props.owner).eq(env.owner.address)
    expect(props.signer).eq(env.owner.address)
    expect(props.rewardToken).eq(REWARD_ADDR)
    expect(tokenHumanAmount(props.price)).eq('0.00001')
  })

  let buyTicketBlockHeight = 0
  let buyTicketTxHash = ''
  it('buy tickets and return extra money', async function () {
    const env = await getEnv()
    // cost 5 * 0.00001 = 0.00005 eth
    // send 0.001 eth
    // retrun 0.00095 eth
    const tx = await env.userContract.buyTicket(5, tokenRealAmount('0.001'))
    buyTicketBlockHeight = tx.blockNumber
    buyTicketTxHash = tx.hash
    expect(tx.status).eq(1)
    expect(tx.hash.length).gt(5)
    expect(buyTicketBlockHeight).gt(0)
    expect(buyTicketTxHash.length).gt(5)
  })

  it('get logs from contract', async function () {
    expect(buyTicketBlockHeight).gt(0)
    expect(buyTicketTxHash.length).gt(5)
    const env = await getEnv()
    const logs = await env.userContract.getLogs(
      buyTicketBlockHeight - 2,
      buyTicketBlockHeight + 2
    )
    console.log(logs)
    const log = logs.find((log) => log.raw.transactionHash === buyTicketTxHash)
    expect(log).has.property('raw')
  })
})
