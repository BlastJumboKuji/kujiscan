import { ProjectData } from '../../../db/models/Project/Project'
import EVMHelper from '../../../utils/EVMHelper'
import KujiOriginv1Contract from '../../../contracts/KujiOriginv1'
import { ProjectModel } from '../../../db/models'

export default async function getProjectInfoFromChain(
  helper: EVMHelper,
  contractAddress: string,
  ownerPk: string
): Promise<ProjectData> {
  const model = await ProjectModel.findOne({
    where: {
      name: 'originv1',
    },
  })

  if (!model) {
    throw new Error('model originv1 not found')
  }

  const signer = await helper.getRandomProviderWallet(ownerPk)
  const contract = new KujiOriginv1Contract(contractAddress, signer)
  const data = await contract.getFullProps()

  const ret: ProjectData = {
    chain: helper.chain,
    contractAddress,
    startTime: new Date(data.startAt * 1000),
    endTime: new Date(data.endAt * 1000),
    rewardTokenAddress: data.rewardToken,
    modelId: model.id,
  }
  return ret
}
