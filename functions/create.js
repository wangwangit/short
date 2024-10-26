/**
 * @api {post} /create Create
 */

// Path: functions/create.js

function generateRandomString(length) {
    const characters = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export async function onRequest(context) {
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400', // 24小时
            },
        });
    }
    const { request, env } = context;
    const originurl = new URL(request.url);
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const userAgent = request.headers.get("user-agent");
    const origin = `${originurl.protocol}//${originurl.hostname}`

    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timedata = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);
    const { url, slug, expiry, password } = await request.json(); // 获取过期时间
        // 验证密码
        if (!password || password !== context.env.ACCESS_PASSWORD) {
            return Response.json({ message: '访问密码错误' }, {
                headers: corsHeaders,
                status: 403
            });
        }
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
    };
    if (!url) return Response.json({ message: 'Missing required parameter: url.' });

    // url格式检查
    if (!/^https?:\/\/.{3,}/.test(url)) {
        return Response.json({ message: 'Illegal format: url.' }, {
            headers: corsHeaders,
            status: 400
        })
    }

    // 自定义slug长度检查 2<slug<10 是否不以文件后缀结尾
    if (slug && (slug.length < 2 || slug.length > 10 || /.+\.[a-zA-Z]+$/.test(slug))) {
        return Response.json({ message: 'Illegal length: slug, (>= 2 && <= 10), or not ending with a file extension.' }, {
            headers: corsHeaders,
            status: 400

        });
    }




    try {

        // 如果自定义slug
        if (slug) {
            const existUrl = await env.DB.prepare(`SELECT url as existUrl FROM links where slug = '${slug}'`).first()

            // url & slug 是一样的。
            if (existUrl && existUrl.existUrl === url) {
                return Response.json({ slug, link: `${origin}/${slug2}` }, {
                    headers: corsHeaders,
                    status: 200
                })
            }

            // slug 已存在
            if (existUrl) {
                return Response.json({ message: 'Slug already exists.' }, {
                    headers: corsHeaders,
                    status: 200
                })
            }
        }

        // 目标 url 已存在
        const existSlug = await env.DB.prepare(`SELECT slug as existSlug FROM links where url = '${url}'`).first()

        // url 存在且没有自定义 slug
        if (existSlug && !slug) {
            return Response.json({ slug: existSlug.existSlug, link: `${origin}/${existSlug.existSlug}` }, {
                headers: corsHeaders,
                status: 200

            })
        }
        const bodyUrl = new URL(url);

        if (bodyUrl.hostname === originurl.hostname) {
            return Response.json({ message: 'You cannot shorten a link to the same domain.' }, {
                headers: corsHeaders,
                status: 400
            })
        }

        // 生成随机slug
        const slug2 = slug ? slug : generateRandomString(4);
        // console.log('slug', slug2);
        // 计算过期时间
        let expiresAt = null;
        if (expiry) {
            const expiryValue = parseInt(expiry.slice(0, -1));
            const expiryUnit = expiry.slice(-1);
        
            const now = new Date();
            switch (expiryUnit) {
                case 'm': // 添加对分钟的处理
                    now.setMinutes(now.getMinutes() + expiryValue);
                    break;
                case 'h':
                    now.setHours(now.getHours() + expiryValue);
                    break;
                case 'd':
                    now.setDate(now.getDate() + expiryValue);
                    break;
                default:
                    break;
            }
            expiresAt = now.toISOString();
        }
        const info = await env.DB.prepare(`INSERT INTO links (url, slug, ip, status, ua, create_time,expires_at) 
        VALUES ('${url}', '${slug2}', '${clientIP}',1, '${userAgent}', '${formattedDate}','${expiresAt}')`).run()

        return Response.json({ slug: slug2, link: `${origin}/${slug2}` }, {
            headers: corsHeaders,
            status: 200
        })
    } catch (e) {
        // console.log(e);
        return Response.json({ message: e.message }, {
            headers: corsHeaders,
            status: 500
        })
    }



}
