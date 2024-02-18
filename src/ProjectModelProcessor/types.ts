import ProjectModel, {
  ProjectModelArgument,
  ProjectModelData,
} from '../db/models/Project/ProjectModel'
import { TicketData } from '../db/models/Project/Ticket'
import ProcessEnvTicketHistory from './ProcessEnvTicketHistory'

export interface ProcessEnvBlock {
  hash: string
  height: number
}

export interface ProcessEnvTransaction {
  hash: string
}

export type ProcessEnvTicketData = Omit<TicketData, 'input' | 'output'>

export interface ProcessEnv {
  args: Record<string, string>
  block: ProcessEnvBlock
  transaction: ProcessEnvTransaction
  history: ProcessEnvTicketHistory
}

export type ProcessFunction = (env: ProcessEnv) => bigint
