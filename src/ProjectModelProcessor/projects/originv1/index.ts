import {
  ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR,
  ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK,
} from '../../../constants'
import { ProjectData } from '../../../db/models/Project/Project'
import EVMHelper from '../../../utils/EVMHelper'
import { SupportedEVMHelperChains } from '../../../utils/EVMHelper/types'
import getProjectInfoFromChain from './getProjectInfoFromChain'

export async function getBlastSepoliaTestnetOriginV1ProjectInfoFromChain(): Promise<ProjectData> {
  if (
    !ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR ||
    !ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK
  ) {
    throw new Error(
      'ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR or ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK not set'
    )
  }
  const helper = new EVMHelper(SupportedEVMHelperChains.blastSepoliaTestnet)
  const contractAddress = ORIGINV1_BLAST_TESTNET_CONTRACT_ADDR
  const ownerPk = ORIGINV1_BLAST_TESTNET_CONTRACT_OWNER_PK
  const data = await getProjectInfoFromChain(helper, contractAddress, ownerPk)
  return data
}
