import { getBlastSepoliaTestnetOriginV1ProjectInfoFromChain } from '../../ProjectModelProcessor/projects'
import Project from '../../db/models/Project/Project'
import env from '../env'

env(async () => {
  const projects = [await getBlastSepoliaTestnetOriginV1ProjectInfoFromChain()]
  for (const project of projects) {
    const [projectRow, created] = await Project.findOrCreate({
      where: {
        contractAddress: project.contractAddress,
      },
      defaults: {
        ...project,
      },
    })
    if (!created) {
      projectRow.setDataValue('startTime', project.startTime)
      projectRow.setDataValue('endTime', project.endTime)
      projectRow.setDataValue('rewardTokenAddress', project.rewardTokenAddress)
      projectRow.setDataValue('modelId', project.modelId)
      await projectRow.save()
    }
    console.log(`${projectRow.contractAddress} at ${projectRow.chain} done!`)
  }
}).catch((e) => console.error(e))
