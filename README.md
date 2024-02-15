# ACCOUNT TIMETABLE SERVICE

## Develop

```
yarn
```

### ENV
```yaml
# if DEBUG=1, will show all debug logs
DEBUG=1
DB_HOST=127.0.0.1
DB_NAME=meeton
DB_USER=root
DB_PASS=
PORT=
# time scale, using for event system. for examle:
# DEV_TIMESCALE=0.0006944444444444445
# makes 1 day become 1 min.
DEV_TIMESCALE=
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

### 初始化

```shell
# 执行初始化脚本
./init.sh
```

### 导出各类信息

#### AKI Lifelogbox

导出当前所有用户提交信息，不lock：
```
yarn run script -- lib/scripts/akilifelogbox/exportCSVAll.js
```

导出当前用户提交信息，但是不lock：
```
yarn run script -- lib/scripts/akilifelogbox/exportCSV.js
```

导出当前用户提交信息，并且lock：
```
yarn run script -- lib/scripts/akilifelogbox/lockAndExportCSV.js
```

执行脚本后，屏幕上会显示文件名，例如：
```
yarn run script -- lib/scripts/akilifelogbox/exportCSV.js

...

akilifelogbox.2023-10-02T11:23:54.043Z.csv
Done in 3.33s
```

获得到文件明后，可以直接用`https://app.toboto.io/output/akilifelogbox.2023-10-02T11:23:54.043Z.csv`下载到结果。

### 常用SQL

#### 查询每日登录数量

```sql
select DATE(CONVERT_TZ(createdAt,'+00:00','+08:00')) as d, count(*) from userEventMaps where eventId = 2 GROUP BY d
```

#### 查询用户推荐关系
```sql
select
    u.id as '用户ID',
    u.address as '用户地址',
    urm.`fatherId` as '上级编号', (
        select address
        from users
        where
            id = urm.`fatherId`
    ) as '上级地址',
    DATE_FORMAT(
        urm.`createdAt`,
        '%Y-%m-%dT%H:%i:%s.000Z'
    ) as '关联时间',
    UNIX_TIMESTAMP(urm.`createdAt`) as '关联时间戳'
from users as u
    LEFT JOIN userReferMaps as urm on u.id = urm.`childId`
ORDER BY
    u.id INTO OUTFILE '/tmp/runoob.txt' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n'
```

#### 更改活动当前上限

```sql
update campaigns set userLimit = 2950 where code = 'akilifelogbox1';
```

#### 常量

| key | type | readonly | description |
| --- | --- | --- | --- |
| defaultVipExpiredAt | string | readonly | 默认的创建账户送的vip过期时间 |
| fakeXVerify | boolean | readonly | 是否开启X假验证 |

#### 1130更新说明

1. 升级node版本

```shell
pm2 stop 0
pm2 del 0
pm2 stop 1
pm2 del 1
nvm install 20.10
nvm use 20.10
nvm alias default 20.10
npm install --global yarn
npm install --global pm2
```

2. pull & yarn

```shell
git pull origin prod
rm -rf node_modules
yarn
```

3. 创建初始文件

```shell
# 检查是否有output目录
# mkdir output
echo '' > output/og
echo '' > output/og_root
echo '' > output/friend
echo '' > output/friend_root
```

4. 修改数据库结构并初始化数据

    1. user: address字段名称换为uuid
    2. 运行 `yarn run script -- lib/scripts/moveAddressFromAddressToWallet.js`
    3. 运行 `select count(*) from users` 和 `select count(*) from userWallets` 检查是否数量对得上。

5. 导入OG数据，将数据文件复制到`output/ogfriend_import`，每一行为`og|friend,address`，运行`yarn run script -- lib/scripts/ogfriend/importData.js`。

6. 生成默克尔树，运行`yarn run script -- lib/scripts/ogfriend/saveLeaves.js`。

7. env文件配置增加字段`OG_FRIEND_CHAIN_ID`，`OG_CONTRACT_ADDRESS`，`FRIEND_CONTRACT_ADDRESS`。

8. 启动实例和监控器，运行`yarn run pm2_start`和`yarn run pm2_start_monitor`。

9. 更新前端文件

