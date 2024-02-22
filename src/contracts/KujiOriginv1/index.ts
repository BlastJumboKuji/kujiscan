import ABI from './KujiOriginv1ABI.json'
import {
  ethers,
  ContractTransactionResponse,
  ContractTransactionReceipt,
  JsonRpcProvider,
} from 'ethers6'
import WrappedContract from '../WrappedContract'
import { MAX_ETH_NUM } from '../../utils/evm'
import Decimal from 'decimal.js-light'

export interface KujiOriginv1ContractProps {
  endAt: number
  startAt: number
  owner: string
  price: string
  signer: string
  rewardToken: string
}

export interface KujiOriginv1Log {
  raw: ethers.Log
  parsed: ethers.LogDescription | null
}

export default class KujiOriginv1Contract extends WrappedContract {
  private _contract?: ethers.Contract

  constructor(address: string, provider: ethers.Signer) {
    super(ABI, address, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }

  private get contract(): ethers.Contract {
    if (!this._contract) {
      this._contract = this.getInstance()
    }
    return this._contract
  }

  // views
  async endAt(): Promise<number> {
    const bn: bigint = await this.contract.endAt()
    return Number(bn)
  }

  async startAt(): Promise<number> {
    const bn: bigint = await this.contract.startAt()
    return Number(bn)
  }

  async owner(): Promise<string> {
    const bn = await this.contract.owner()
    return bn
  }

  async price(): Promise<string> {
    const bn = await this.contract.price()
    return bn.toString()
  }

  async signer(): Promise<string> {
    const bn = await this.contract.signer()
    return bn
  }

  async rewardToken(): Promise<string> {
    const bn = await this.contract.rewardToken()
    return bn
  }

  async getFullProps(): Promise<KujiOriginv1ContractProps> {
    const [endAt, startAt, owner, price, signer, rewardToken] =
      await Promise.all([
        this.endAt(),
        this.startAt(),
        this.owner(),
        this.price(),
        this.signer(),
        this.rewardToken(),
      ])

    return {
      endAt,
      startAt,
      owner,
      price,
      signer,
      rewardToken,
    }
  }

  // functions
  async buyTicket(
    amount: number,
    overwriteValue?: string
  ): Promise<ContractTransactionReceipt> {
    let value = overwriteValue
    if (!value) {
      value = await this.price()
      value = new Decimal(value).mul(amount).toString()
    }
    const tx: ContractTransactionResponse = await this.contract.buyTicket(
      amount,
      {
        value,
      }
    )
    const txwait = await tx.wait()
    if (!txwait) {
      throw new Error('Transaction failed')
    }
    return txwait
  }

  async changeTime(
    startAt: number,
    endAt: number
  ): Promise<ContractTransactionReceipt> {
    const tx: ContractTransactionResponse = await this.contract.changeTime(
      startAt,
      endAt
    )
    const txwait = await tx.wait()
    if (!txwait) {
      throw new Error('Transaction failed')
    }
    return txwait
  }

  // others
  async getLogs(
    fromBlock: number,
    toBlock: number
  ): Promise<KujiOriginv1Log[]> {
    const logs = await this.provider.provider!.getLogs({
      fromBlock,
      toBlock,
      address: this.address,
    })
    const events = logs.map((log) => {
      const description = this.contract.interface.parseLog(log)
      return {
        raw: log,
        parsed: description,
      }
    })
    return events
  }
}
