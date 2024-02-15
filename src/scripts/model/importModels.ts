import ProjectModel, {
  ProjectModelArgument,
} from '../../db/models/Project/ProjectModel'
import env from '../env'
import models from './models'

env(async () => {
  for (const model of models) {
    const [modelRow, created] = await ProjectModel.findOrCreate({
      where: {
        name: model.name,
      },
      defaults: {
        ...model,
      },
    })
    if (created) {
      for (const arg of model.arguments) {
        await ProjectModelArgument.findOrCreate({
          where: {
            modelId: modelRow.id,
            name: arg.name,
          },
          defaults: {
            ...arg,
            modelId: modelRow.id,
          },
        })
      }
    }
  }
}).catch((e) => console.error(e))
