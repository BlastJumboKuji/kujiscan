import ProjectModel, {
  ProjectModelArgument,
  ProjectModelData,
} from './ProjectModel'
import { TicketData } from './Ticket'

interface ProcessEnvBlock {
  hash: string
  height: number
}

interface ProcessEnvTransaction {
  hash: string
}

export type ProcessEnvTicketData = Omit<TicketData, 'input' | 'output'>

export interface ProcessEnv {
  args: Record<string, string>
  block: ProcessEnvBlock
  transaction: ProcessEnvTransaction
  history: ProcessEnvTicketHistory
}

type ProcessFunction = (env: ProcessEnv) => bigint

function process(
  model: ProjectModelData,
  getAmountFunction: (env: any) => bigint
): ProcessFunction {
  const argOrigin = (key: string, args: Record<string, string>): any => {
    const tv = args[key]
    if (!tv) {
      throw new Error(`Argument ${key} is required`)
    }
    const arg = model.arguments.find((a) => a.name === key)
    if (!arg) {
      throw new Error(`Argument ${key} not found in model ${model.name}`)
    }
    const type = arg.type
    switch (type) {
      case 'boolean':
        return tv === 'true'
      case 'integer':
        return BigInt(tv)
      case 'string':
        return tv
      default:
        throw new Error(`Unsupported argument type: ${type as string}`)
    }
  }
  return (env: ProcessEnv): bigint => {
    const pressedEnv = {
      ...env,
      arg: (key: string) => argOrigin(key, env.args),
    }
    return getAmountFunction(pressedEnv)
  }
}

const GetAmountFunctionTemplate = `
const arg = env.arg;
`

export default class ProjectModelProcessor {
  private processor!: ProcessFunction

  constructor(private readonly model: ProjectModelData) {
    this.initProcessorFunction(model)
  }

  private initProcessorFunction(model: ProjectModelData): void {
    const { arguments: args, code } = this.model
    let functionCode = GetAmountFunctionTemplate
    for (const arg of args) {
      functionCode += `const ${arg.name} = arg("${arg.name}");\n`
    }
    functionCode += `${code};\n\n`
    functionCode += 'return result;\n'
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const getAmountFunction = new Function('env', functionCode)
    const processor = process(model, getAmountFunction as (env: any) => bigint)
    this.processor = processor
  }

  process(env: ProcessEnv): bigint {
    return this.processor(env)
  }
}

export class ProcessEnvTicketHistory extends Array<ProcessEnvTicketData> {
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
