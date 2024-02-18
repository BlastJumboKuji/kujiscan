import { ProjectModelData } from '../../db/models/Project/ProjectModel'
import testModel from './test'
import originv1Model from './originv1'

const models: Record<string, ProjectModelData> = {
  test: testModel,
  originv1: originv1Model,
}

export default models
