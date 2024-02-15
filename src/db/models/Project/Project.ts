import {
  Table,
  Column,
  AllowNull,
  Unique,
  DataType,
  Default,
  Model,
} from 'sequelize-typescript'

@Table({
  modelName: 'project',
})
export default class Project extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(50))
  get chain(): string {
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

  @AllowNull(false)
  @Column(DataType.STRING(50))
  get modelName(): string {
    return this.getDataValue('modelName')
  }
}
