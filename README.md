## Projects Introduction

**Introduction**: Use Cloudflare Pages to create Shortener of URL

**My Demo**  : [https://d.igdu.xyz/](https://d.igdu.xyz/);

**Original author's Demo** : [https://d.131213.xyz/](https://d.131213.xyz/)



## Installatin: Use Cloudflare pages to deploy

### Steps are as follows

1.Fork this project, name it as you like, such as "Short". I have made some change based on the original project [https://github.com/x-dr/short](https://github.com/x-dr/short), such as adding footer of website and the action after shortening the URL. Thanks for the original project and it's author.

2.Connect this git project with your Cloudflare Pages and deploy your project. 

​	2.1 Creat and login in your Cloudflare account;

​	2.2 In Workers and Pages, select pages, create a project,  connect to git, choose your forked git program.

​	2.3 Set up builds and deployments, choose the default setting. Waiting Cloudflare's deploying, then it will be ok.

3.Creat database D1 to store the necessary data. Choose D1, create database, give a name as you like for this D1(such as Shorturl) , create and it's ok for D1 with name Shorturl.
Refer to [D1's create](https://github.com/x-dr/telegraph-Image/blob/main/docs/manage.md)

4.Go to the workers and pages's console to put and execute the SQL commands. Commands are as follow, just copy them and put them to console station to execute them.

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

5.Bind your project with D1 database. In your Workers and pages, choose your forked project Short, click as follow:

Setting->->Function->->D1 database bindings->->Edit bingds->->Variable name, You must put DB->->Namespace, put your D1's name, such as Shorturl->->Binding and Done well.

6.Redeploy the project, otherwise you will see the errors. Methods: In your Workers and pages, choose your forked project Short, Deployments, Redeploy the project.

7.If you like, your project could works well with Cloudflare's subdomain, such as short-998.pages.dev. If you want to Custom the project domain, in Cloudflare's forked project,choose the custom domian setting, then bind your domain. Then you could surf your project with your domain, such as d.igdud.xyz.

8.Enjoy it. If you like or it helps you, please star it. Thanks. 

**9.API**

#### Shorturl create

```bash
# POST /create
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://igdu.xyz"}' https://d.igdu.xyz/create

# Dedicated slug
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://igdu.xyz","slug":"scxs"}' https://d.igdu.xyz/create

```


> response:

```json
{
  "slug": "<slug>",
  "link": "http://d.igdu.xyz/<slug>"
}
```
