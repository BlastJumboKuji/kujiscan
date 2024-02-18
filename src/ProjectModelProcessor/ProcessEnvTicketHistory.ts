import { ProcessEnvTicketData } from './types'

export default class ProcessEnvTicketHistory extends Array<ProcessEnvTicketData> {
  constructor(array: ProcessEnvTicketData[]) {
    super()
    const arr = [...array]
    arr.sort((a, b) => a.blockHeight - b.blockHeight)
    this.push(...arr)
  }

  static fromArray(array: ProcessEnvTicketData[]): ProcessEnvTicketHistory {
    return new ProcessEnvTicketHistory(array)
  }

  before(hash: string): ProcessEnvTicketData | undefined {
    const targetIndex = this.findIndex((t) => t.transactionHash === hash)
    if (targetIndex === -1) return undefined
    return this[targetIndex - 1]
  }

  after(hash: string): ProcessEnvTicketData | undefined {
    const targetIndex = this.findIndex((t) => t.transactionHash === hash)
    if (targetIndex === -1) return undefined
    return this[targetIndex + 1]
  }
}
