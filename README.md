## 介绍

一个使用 Cloudflare Pages 创建的 URL 缩短器

*Demo* : [https://d.igdu.xyz/](https://d.igdu.xyz/)



### 利用Cloudflare pages部署


1. Fork本项目，如果需要可适当修改。
    **说明** ：非常感谢原作者的贡献。我在原项目[https://github.com/x-dr/short](https://github.com/x-dr/short)基础上，做了细微调整：
   包括修改页脚文字，修改生产短链后的动作等。你如果也想自己部署一个同样的短网址服务，可以在Fork本项目之后，在index.js中修改相应的代码。
2. 登录到[Cloudflare](https://dash.cloudflare.com/)控制台.
3. 在帐户主页中，选择`pages`> ` Create a project` > `Connect to Git`
4. 选择你创建的项目存储库，在`Set up builds and deployments`部分中，全部默认即可。
5. 点击`Save and Deploy`，稍等片刻，你的网站就部署好了。
6. 创建D1数据库，自己取名，如命名为Shorturl；参考[这里](https://github.com/x-dr/telegraph-Image/blob/main/docs/manage.md)
7. 在works and pages控制台，执行sql命令创建表（在控制台输入框粘贴下面语句执行即可）

```sql
DROP TABLE IF EXISTS links;
CREATE TABLE IF NOT EXISTS links (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text,
  `slug` text,
  `ua` text,
  `ip` text,
  `status` int,
  `create_time` DATE
);
DROP TABLE IF EXISTS logs;
CREATE TABLE IF NOT EXISTS logs (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text ,
  `slug` text,
  `referer` text,
  `ua` text ,
  `ip` text ,
  `create_time` DATE
);

```
8. 选择部署完成short项目，前往后台依次点击`设置`->`函数`->`D1 数据库绑定`->`编辑绑定`->变量名称填写：`DB`   命名空间选择 `你提前创建好的D1数据库名称，如shorturl`；最终完成数据库的绑定。

9. 重新部署项目，最终完成。这里必须要重新部署，否则会提示错误。
    
10. 该服务基于Cloudflare提供的免费的轻量服务，请勿乱用、滥用。谢谢原作者和Github。


### API

#### 短链生成

```bash
# POST /create
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://131213.xyz"}' https://d.131213.xyz/create

# 指定slug
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://131213.xyz","slug":"scxs"}' https://d.131213.xyz/create

```



> response:

```json
{
  "slug": "<slug>",
  "link": "http://d.131213.xyz/<slug>"
}
```



