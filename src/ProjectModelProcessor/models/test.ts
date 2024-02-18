import { ProjectModelData } from '../../db/models/Project/ProjectModel'

const define: ProjectModelData = {
  name: 'test',
  arguments: [
    {
      modelId: 1,
      name: 'a',
      type: 'integer',
    },
    {
      modelId: 1,
      name: 'b',
      type: 'boolean',
    },
    {
      modelId: 1,
      name: 'c',
      type: 'string',
    },
  ],
  code: `
let result = a;
if (b) {
  result += 1n;
} else {
  result += 2n;
}
if (c === 'test') {
  result += 10n;
}
`,
}

export default define
