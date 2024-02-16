# KUJI SCAN

## Develop

```
yarn
```

### ENV
```yaml
# if DEBUG=1, will show all debug logs
DEBUG=1
DB_HOST=127.0.0.1
DB_NAME=kuji-scan
DB_USER=root
DB_PASS=
PORT=8089
```

### Service

Using following command to start server.

```
yarn run start
```

### Task

Using following command to start task runner.

```
yarn run start_task
```

### Scripts

Using following command to run script.

```
yarn run script -- ./lib/scripts/__SCRIPT_NAME__.js
```

Looking for `src/scripts` folder to geet `__SCRIPT_NAME__`.

## Project Model

We try to give each project an elastic, non-hard-coded computational model, which requires that such a model accepts multiple amounts of inputs and needs to be injected with environmental variables, such as information about the transactions, blocks and datetime, and at the same time, the computation itself is not a fixed scheme, it needs to be flexible.

We refer to a variety of solutions and believe that an implementation using JavaScript may be the simplest primitive solution. The structure can be found in `src/db/models/Project/ProjectModelProcessor.ts`.

Security

This type of dynamically generated function code is not safe, e.g. using `eval` or `Function`. But even so, `Function` is still slightly better than `eval`.

We have created a closure environment in our implementation, where the computation model can only be a stateless function, and there are strict state checks on input to prevent injection attacks.

**But this is still a bad design pattern. It's just that this pattern is easiest to implement in our controlled working environment. Remember, DO NOT open this feature to users.**

In subsequent upgrades, we will port the computation process to a sandbox environment to increase its scalability and security.
