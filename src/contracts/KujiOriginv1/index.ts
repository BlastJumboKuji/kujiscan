import ABI from './KujiOriginv1ABI.json'
import {
  ethers,
  ContractTransactionResponse,
  ContractTransactionReceipt,
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

  // props
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
    const endAt = await this.endAt()
    const startAt = await this.startAt()
    const owner = await this.owner()
    const price = await this.price()
    const signer = await this.signer()
    const rewardToken = await this.rewardToken()

    return {
      endAt,
      startAt,
      owner,
      price,
      signer,
      rewardToken,
    }
  }
}
