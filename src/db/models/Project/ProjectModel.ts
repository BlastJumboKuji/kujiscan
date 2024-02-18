import {
  Table,
  Column,
  AllowNull,
  Unique,
  DataType,
  Default,
  Model,
  BelongsTo,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript'
import Project from './Project'

export type ProjectModelArgumentType = 'string' | 'integer' | 'boolean'
export interface ProjectModelArgumentData {
  modelId: number
  name: string
  type: ProjectModelArgumentType
}
export interface ProjectModelData {
  name: string
  code: string
  arguments: ProjectModelArgumentData[]
}

@Table({
  modelName: 'projectModel',
})
export default class ProjectModel extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  get name(): string {
    return this.getDataValue('name')
  }

  @AllowNull(false)
  @Column(DataType.TEXT)
  get code(): string {
    return this.getDataValue('code')
  }

  @HasMany(() => ProjectModelArgument)
  get arguments(): ProjectModelArgument[] {
    return this.getDataValue('arguments') ?? []
  }

  set arguments(_arguments: ProjectModelArgument[]) {
    //
  }

  getData(): ProjectModelData {
    return {
      name: this.name,
      code: this.code,
      arguments: this.arguments.map((arg) => arg.getData()),
    }
  }

  async getFullModelData(): Promise<ProjectModelData> {
    await this.reload({
      include: [ProjectModelArgument],
    })
    return {
      name: this.name,
      code: this.code,
      arguments: this.arguments.map((a) => a.getData()),
    }
  }
}

@Table({
  modelName: 'projectModelArgument',
  indexes: [
    {
      fields: ['modelId', 'name'],
      unique: true,
    },
  ],
})
export class ProjectModelArgument extends Model {
  @ForeignKey(() => ProjectModel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  get modelId(): number {
    return this.getDataValue('modelId')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  get name(): string {
    return this.getDataValue('name')
  }

  @AllowNull(false)
  @Column(DataType.CHAR(20))
  get type(): ProjectModelArgumentType {
    return this.getDataValue('type')
  }

  @BelongsTo(() => ProjectModel, 'modelId')
  get model(): ProjectModel {
    return this.getDataValue('model')
  }

  set model(model: ProjectModel) {
    //
  }

  getData(): ProjectModelArgumentData {
    return {
      modelId: this.modelId,
      name: this.name,
      type: this.type,
    }
  }
}
