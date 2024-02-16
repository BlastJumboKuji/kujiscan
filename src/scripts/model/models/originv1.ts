import { ProjectModelData } from '../../../db/models/Project/ProjectModel'

const define: ProjectModelData = {
  name: 'originv1',
  arguments: [
    {
      modelId: 1,
      name: 'base',
      type: 'integer',
    },
    {
      modelId: 1,
      name: 'cd',
      type: 'integer',
    },
    {
      modelId: 1,
      name: 'X',
      type: 'integer',
    },
  ],
  code: `
const block = env.block;
const transaction = env.transaction;
const history = env.history;

function n(hash) {
  const reg = /^[0-9]$/ig;
  return hash
    .split('')
    .filter((i) => reg.test(i))
    .map((i) => parseInt(i))
    .reduce((a, b) => a + b, 0)
    % 10
};;

let a = Math.abs(n(block.hash) - n(transaction.hash));
if (a === 0) {
  a = 10;
}
a = BigInt(a);

const ap = arg("a" + a);

let diff = cd;
const prevTicket = history.before(transaction.hash);
if (prevTicket) {
  const prev = history.before(transaction.hash).blockHeight;
  const current = block.height;
  if (BigInt(current - prev) < cd) {
    diff = BigInt(current - prev);
  }
}
diff = BigInt(diff);
// b = diff / cd;

// base * a * ap * b * X
// base * a * ap * diff * X / cd
result = base * a * ap * diff * X / cd
`,
}

for (let a = 1; a <= 10; a++) {
  const name = `a${a}`
  define.arguments.push({
    modelId: 1,
    name,
    type: 'integer',
  })
}

export default define
