import {
  Table,
  Column,
  AllowNull,
  Unique,
  DataType,
  Default,
  Model,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import Project from './Project'
import ProjectModel from './ProjectModel'

type TicketState = 'created' | 'processing' | 'processed'

export interface TicketData {
  state: TicketState
  projectId: number
  address: string
  transactionHash: string
  blockHash: string
  blockHeight: number
  blockTimestamp: number
  input: any
  output: any
  modelId: number
}

@Table({
  modelName: 'ticket',
  indexes: [
    {
      fields: ['projectId'],
    },
    {
      fields: ['address'],
    },
    {
      fields: ['blockHash'],
    },
    {
      fields: ['blockHeight'],
    },
    {
      fields: ['state'],
    },
    {
      fields: ['transactionHash'],
      unique: true,
    },
  ],
})
export default class Ticket extends Model {
  @AllowNull(false)
  @Column(DataType.CHAR(20))
  get state(): TicketState {
    return this.getDataValue('state')
  }

  @ForeignKey(() => Project)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get projectId(): number {
    return this.getDataValue('projectId')
  }

  @BelongsTo(() => Project, 'projectId')
  get project(): Project {
    return this.getDataValue('project')
  }

  set project(project: Project) {
    //
  }

  @AllowNull(false)
  @Column(DataType.STRING(100))
  get address(): string {
    return this.getDataValue('address')
  }

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  get transactionHash(): string {
    return this.getDataValue('transactionHash')
  }

  @AllowNull(false)
  @Column(DataType.STRING(100))
  get blockHash(): string {
    return this.getDataValue('blockHash')
  }

  @AllowNull(false)
  @Column(DataType.INTEGER)
  get blockHeight(): number {
    return this.getDataValue('blockHeight')
  }

  @AllowNull(false)
  @Column(DataType.INTEGER)
  get blockTimestamp(): number {
    return this.getDataValue('blockTimestamp')
  }

  @AllowNull(true)
  @Column(DataType.JSON)
  get input(): any {
    return this.getDataValue('input')
  }

  @AllowNull(true)
  @Column(DataType.JSON)
  get output(): any {
    return this.getDataValue('output')
  }

  @ForeignKey(() => ProjectModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get modelId(): number {
    return this.getDataValue('modelId')
  }

  getData(): TicketData {
    return {
      state: this.state,
      projectId: this.projectId,
      address: this.address,
      transactionHash: this.transactionHash,
      blockHash: this.blockHash,
      blockHeight: this.blockHeight,
      blockTimestamp: this.blockTimestamp,
      input: this.input,
      output: this.output,
      modelId: this.modelId,
    }
  }
}
