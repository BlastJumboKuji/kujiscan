import ProjectModel, {
  ProjectModelArgument,
  ProjectModelData,
} from './ProjectModel'

function process(
  model: ProjectModelData,
  getAmountFunction: (env: any) => bigint
): (args: Record<string, string>) => bigint {
  const arg = (key: string, args: Record<string, string>): any => {
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
  return (args: Record<string, string>): bigint => {
    const env = { arg, args }
    return getAmountFunction(env)
  }
}

const GetAmountFunctionTemplate = `
const arg = env.arg;
const args = env.args;
`

export default class ProjectModelProcessor {
  private processor!: (args: Record<string, string>) => bigint

  constructor(private readonly model: ProjectModelData) {
    this.initProcessorFunction(model)
  }

  private initProcessorFunction(model: ProjectModelData): void {
    const { arguments: args, code } = this.model
    let functionCode = GetAmountFunctionTemplate
    for (const arg of args) {
      functionCode += `const ${arg.name} = arg("${arg.name}", args);\n`
    }
    functionCode += `${code};\n\n`
    functionCode += 'return result;\n'
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const getAmountFunction = new Function('env', functionCode)
    const processor = process(model, getAmountFunction as (env: any) => bigint)
    this.processor = processor
  }

  process(args: Record<string, string>): bigint {
    return this.processor(args)
  }
}
