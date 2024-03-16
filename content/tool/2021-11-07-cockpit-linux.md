---
title : "安装cockpit通过nginx代理访问"
---

安装cockpit后，默认只能通过IP地址+端口号来访问。其实，还可以通过nginx代理来访问。

## 添加Nginx.conf配置

```
 
## 添加并修改
vi /etc/nginx/conf.d/cockpit.godgodgame.com

-------------------------------------------------------------------------------------

#使用cockpt名称配置上游服务器
upstream cockpit {
	server 127.0.0.1:9090;
}
 
#将http重定向到https
server{
    listen 80;
    server_name cockpit.godgodgame.com;
    return 301 https://$server_name$request_uri;
}

#使用https访问并配置ssl
server {
    listen 443 ssl http2;
    #填写绑定证书的域名
    server_name cockpit.godgodgame.com;
    
    
    #证书文件名称
    ssl_certificate /etc/nginx/cert/1_godgodgame.com_bundle.crt;
    #私钥文件名称
    ssl_certificate_key /etc/nginx/cert/2_godgodgame.com.key;
    ssl_session_timeout 5m;
    #请按照以下协议配置
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; 
    #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
    ssl_prefer_server_ciphers on;
 
    location / {
 		# Required to proxy the connection to Cockpit
        proxy_pass https://cockpit;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Required for web sockets to function
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Pass ETag header from Cockpit to clients.
        # See: https://github.com/cockpit-project/cockpit/issues/5239
        gzip off;
    }
}
-------------------------------------------------------------------------------------
# 先检查nginx配置是否有效/无有异常,如果有异常请按照异常提示修改；使用nginx -t进行nginx.conf的配置检测
$ nginx -t;
 
# 重启nginx
$ nginx -s reload;
```

## 修改Cockpit

这时输入域名，能看到登录页面，但登录后，显示不出内容，页面全白

```
sudo vim /etc/cockpit/cockpit.conf

参照如下配置修改，注意域名替换为your_domain_host：
[WebService]
Origins = https://cockpit.godgodgame.com https://127.0.0.1:9090
ProtocolHeader = X-Forwarded-Proto
AllowUnencrypted = true

systemctl restart cockpit
```

```
map $http_upgrade $connection_upgrade { default upgrade; '' close; }
 
upstream websocket {
server 127.0.0.1:9090;
}
 
server{
    listen 80;
    server_name cockpit.godgodgame.com;
    return 301 https://$server_name$request_uri;
}
 
server {
    listen 443 ssl http2;
    server_name cockpit.godgodgame.com;
 
    #ssl on;
    ssl_certificate /etc/nginx/cert/1_cockpit.godgodgame.com_bundle.crt;
    ssl_certificate_key /etc/nginx/cert/2_cockpit.godgodgame.com.key;
 
    location / {
        root /;
        index index.html;
        proxy_redirect off;
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
    }
}
```

## 参考链接

-   [Proxying Cockpit over nginx · cockpit-project/cockpit Wiki (github.com)](https://github.com/cockpit-project/cockpit/wiki/Proxying-Cockpit-over-nginx)

-   <https://cloud.tencent.com/document/product/400/35244>
