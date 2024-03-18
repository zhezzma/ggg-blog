---
title : "code server安装制作online ide"
---

## **官方文档**

- [code-server v4.0.2 docs (](https://coder.com/docs/code-server/latest)[coder.com](http://coder.com)[)](https://coder.com/docs/code-server/latest)

- [coder/code-server: VS Code in the browser (](https://github.com/coder/code-server)[github.com](http://github.com)[)](https://github.com/coder/code-server)

## **原理基础**

code-server是一款基于VScode的在线编辑器,主要用于在Linux服务器环境下,实现任何设备通过浏览器即可访问VScode, 进而实现在远程编程.

## **安装**

### linux标准安装方式

```
mkdir -p ~/.local/lib ~/.local/bin
curl -fL https://github.com/cdr/code-server/releases/download/v$VERSION/code-server-$VERSION-linux-amd64.tar.gz \
  | tar -C ~/.local/lib -xz
mv ~/.local/lib/code-server-$VERSION-linux-amd64 ~/.local/lib/code-server-$VERSION
ln -s ~/.local/lib/code-server-$VERSION/bin/code-server ~/.local/bin/code-server
PATH="~/.local/bin:$PATH"
code-server
# Now visit http://127.0.0.1:8080. Your password is in ~/.config/code-server/config.yaml
```

### Fedora, CentOS, RHEL, SUSE

```
curl -fOL https://github.com/cdr/code-server/releases/download/v$VERSION/code-server-$VERSION-amd64.rpm
sudo rpm -i code-server-$VERSION-amd64.rpm
sudo systemctl enable --now code-server@$USER
# Now visit http://127.0.0.1:8080. Your password is in ~/.config/code-server/config.yaml

systemctl start code-server@$USER
systemctl stop code-server@$USER
```

### windows

推荐使用yarn或者npm进行安装

```
yarn global add code-server
# Or: npm install -g code-server
code-server
# Now visit http://127.0.0.1:8080. Your password is in ~/.config/code-server/config.yaml
```

## 配置

配置文件一般在`~/.config/code-server/config.yaml`,可以将ip配置成`0.0.0.0`,然后将域名解析到该服务器

```
bind-addr: 127.0.0.1:8080
auth: password
password: *************
cert: false
```

安装nginx,并且配置https,否则很多插件不能使用

```
yum install  -y nginx certbot python3-certbot-nginx
vim /etc/nginx/conf.d/dev.godgodgame.com.conf
```

nginx.配置文件

```
server {
    listen 443 ssl;
    #填写绑定证书的域名
    server_name dev.godgodgame.com;
    #证书文件名称
    ssl_certificate  /etc/nginx/certs/dev.godgodgame.com_bundle.crt;
    #私钥文件名称
    ssl_certificate_key /etc/nginx/certs/dev.godgodgame.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    location / {
      proxy_pass http://127.0.0.1:8080/;
      proxy_set_header Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection upgrade;
      proxy_set_header Accept-Encoding gzip;
    }
}
server {
    listen 80;
    #填写绑定证书的域名
    server_name cloud.tencent.com;
    #把http的域名请求转成https
    return 301 https://$host$request_uri;
}

# 先检查nginx配置是否有效/无有异常,如果有异常请按照异常提示修改；使用nginx -t进行nginx.conf的配置检测
$ nginx -t;
$ systemctl enable nginx
```