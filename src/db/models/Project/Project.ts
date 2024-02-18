import {
  Table,
  Column,
  AllowNull,
  Unique,
  DataType,
  Default,
  Model,
  HasOne,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import { SupportedEVMHelperChains } from '../../../utils/EVMHelper/types'
import ProjectModel, {
  ProjectModelArgument,
  ProjectModelData,
} from './ProjectModel'

export interface ProjectData {
  chain: SupportedEVMHelperChains
  contractAddress: string
  startTime: Date
  endTime: Date
  rewardTokenAddress: string
  modelId: number
  model?: ProjectModelData
}

@Table({
  modelName: 'project',
})
export default class Project extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(50))
  get chain(): SupportedEVMHelperChains {
    return this.getDataValue('chain')
  }

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  get contractAddress(): string {
    return this.getDataValue('contractAddress')
  }

  @AllowNull(false)
  @Column(DataType.DATE)
  get startTime(): Date {
    return this.getDataValue('startTime')
  }

  @AllowNull(false)
  @Column(DataType.DATE)
  get endTime(): Date {
    return this.getDataValue('endTime')
  }

  @AllowNull(false)
  @Column(DataType.STRING(100))
  get rewardTokenAddress(): string {
    return this.getDataValue('rewardTokenAddress')
  }

  @ForeignKey(() => ProjectModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get modelId(): number {
    return this.getDataValue('modelId')
  }

  @BelongsTo(() => ProjectModel, 'modelId')
  get model(): ProjectModel {
    return this.getDataValue('model')
  }

  set model(model: ProjectModel) {
    //
  }

  async getFullData(): Promise<ProjectData> {
    await this.reload({
      include: [
        {
          model: ProjectModel,
          include: [ProjectModelArgument],
        },
      ],
    })
    return {
      chain: this.chain,
      contractAddress: this.contractAddress,
      startTime: this.startTime,
      endTime: this.endTime,
      rewardTokenAddress: this.rewardTokenAddress,
      modelId: this.modelId,
      model: this.model.getData(),
    }
  }
}
