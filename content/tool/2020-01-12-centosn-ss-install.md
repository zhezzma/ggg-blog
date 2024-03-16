---
title:  "CentOS 下安装Shadowsocks 搭建ss"
---

CentOS 7 开始默认使用[Systemd](https://en.wikipedia.org/wiki/Systemd)作为开启启动脚本的管理工具，[Shadowsocks](https://github.com/shadowsocks/)则是当前比较受欢迎的科学上网工具，本文将介绍如何在 CentOS 下安装和配置 Shadowsocks 服务。

## 安装 pip

[pip](https://pip.pypa.io/en/stable/installing/)是 python 的包管理工具。在本文中将使用 python 版本的 shadowsocks，此版本的 shadowsocks 已发布到 pip 上，因此我们需要通过 pip 命令来安装。

在控制台执行以下命令安装 pip：

```bash
curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
python3 get-pip.py
```

或者

```
sudo yum -y install epel-release
sudo yum -y install python-pip
```

## 安装配置 shadowsocks

在控制台执行以下命令安装 shadowsocks：

```bash
pip install --upgrade pip
pip install shadowsocks
```

## 客户端

需要创建配置文件`/etc/shadowsocks.json`，内容如下：

```
{
    "server":"1.1.1.1",
    "server_port":1035,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"password",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false,
    "workers": 1
}
```

配置说明：

1.  server：Shadowsocks服务器地址

2.  server\_port：Shadowsocks服务器端口

3.  local\_address：本地IP，本地使用的 sock5 代理 ip

4.  local\_port：本地端口，本地使用的 sock5 代理端口

5.  password：Shadowsocks连接密码

6.  timeout：等待超时时间

7.  method：加密方式

8.  workers:工作线程数

9.  fast\_open：true或false。开启fast\_open以降低延迟，但要求Linux内核在3.7+。开启方法 echo 3 > /proc/sys/net/ipv4/tcp\_fastopen

上述配置需要根据情况进行修改，接下来需要启动服务，就可以通过 local\_address 和 local\_port 来使用 sock5 代理，流量就可以走 ss 了

配置启动脚本文件 /etc/systemd/system/shadowsocks.service

```
[Unit]
Description=Shadowsocks

[Service]
TimeoutStartSec=0
ExecStart=/usr/bin/sslocal -c /etc/shadowsocks/shadowsocks.json

[Install]
WantedBy=multi-user.target
```

启用启动脚本，启动 ss 服务

```
# 配置服务开机启动
sudo systemctl enable shadowsocks.service
# 启动服务
sudo systemctl start shadowsocks.service
# 查看服务状态
sudo systemctl status shadowsocks.service
```

验证安装

```
$ curl --socks5 127.0.0.1:1080 http://httpbin.org/ip
{"origin":"x.x.x.x"}
```

至此就完成了 ss 客户端的安装配置。

### 前台运行

```
sslocal -c /etc/shadowsocks.json
```

### 后台运行

```
sslocal -c /etc/shadowsocks.json -d start
sslocal -c /etc/shadowsocks.json -d stop
```

## `method aes-256-gcm not supported`方法

```
pip install https://github.com/shadowsocks/shadowsocks/archive/master.zip -U
apt-get install build-essential
wget https://download.libsodium.org/libsodium/releases/LATEST.tar.gz
tar xf LATEST.tar.gz && cd libsodium-*.*.*
./configure && make -j4 && make install
ldconfig
```

# proxychains

proxychains 的官方介绍：

> proxychains ng (new generation) - a preloader which hooks calls to sockets in dynamically linked programs and redirects it through one or more socks/http proxies.

proxychains 是一种访问代理的方式，用法如下：

```
proxychains4 curl http://httpbin.org/ip
```

这样可以使得 curl 走代理来访问网络。

## 安装

首先去 [proxychains 官网](https://github.com/rofl0r/proxychains-ng) 下载代码进行编译安装，常规的 configure && make 方式，没啥特别之处。

```
./configure

make -j

sudo make install
```

## 配置

创建配置文件

```
mkdir -p ~/.proxychains
vi ~/.proxychains/proxychains.conf
```

proxychains.conf 配置如下：

```
strict_chain
proxy_dns
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000
localnet 127.0.0.0/255.0.0.0
quiet_mode

[ProxyList]
socks5  127.0.0.1 1080
```

ProxyList 的配置要与上面的 ss 配置一致，即可通过代理访问网络，使用起来还是很方便的。

## 用法

proxychains 可以通过启动一个 bash 来使得当前终端全局走代理

```
proxychains4 bash
```

## 服务端

需要创建配置文件`/etc/shadowsocks.json`，内容如下：

```json
{
  "server": "0.0.0.0",
  "server_port": 8388,
  "password": "uzon57jd0v869t7w",
  "method": "aes-256-cfb"
}
```

说明：

-   `method`为加密方法，可选`aes-128-cfb, aes-192-cfb, aes-256-cfb, bf-cfb, cast5-cfb, des-cfb, rc4-md5, chacha20, salsa20, rc4, table`

-   `server_port`为服务监听端口

-   `password`为密码，可使用[密码生成工具](http://ucdok.com/project/generate_password.html)生成一个随机密码

以上三项信息在配置 shadowsocks 客户端时需要配置一致，具体说明可查看 shadowsocks 的帮助文档。

新建启动脚本文件`/etc/systemd/system/shadowsocks.service`，内容如下：

```
[Unit]
Description=Shadowsocks
After=network.target auditd.service

[Service]
Type=forking
TimeoutStartSec=0
ExecStart=/usr/local/bin/ssserver -c /etc/shadowsocks.json --pid-file /var/run/shadowsocks.pid -d start
ExecStop=/usr/local/bin/ssserver -c /etc/shadowsocks.json  --pid-file /var/run/shadowsocks.pid -d stop
PIDFile=/var/run/shadowsocks.pid
Restart=always
RestartSec=4


[Install]
WantedBy=multi-user.target
```

执行以下命令启动 shadowsocks 服务：

```bash
systemctl enable shadowsocks
systemctl start shadowsocks
```

为了检查 shadowsocks 服务是否已成功启动，可以执行以下命令查看服务的状态：

```bash
systemctl status shadowsocks -l
```

如果服务启动成功，则控制台显示的信息可能类似这样：

```
● shadowsocks.service - Shadowsocks
   Loaded: loaded (/etc/systemd/system/shadowsocks.service; enabled; vendor preset: disabled)
   Active: active (running) since Mon 2015-12-21 23:51:48 CST; 11min ago
 Main PID: 19334 (ssserver)
   CGroup: /system.slice/shadowsocks.service
           └─19334 /usr/bin/python /usr/bin/ssserver -c /etc/shadowsocks.json

Dec 21 23:51:48 morning.work systemd[1]: Started Shadowsocks.
Dec 21 23:51:48 morning.work systemd[1]: Starting Shadowsocks...
Dec 21 23:51:48 morning.work ssserver[19334]: INFO: loading config from /etc/shadowsocks.json
Dec 21 23:51:48 morning.work ssserver[19334]: 2015-12-21 23:51:48 INFO     loading libcrypto from libcrypto.so.10
Dec 21 23:51:48 morning.work ssserver[19334]: 2015-12-21 23:51:48 INFO     starting server at 0.0.0.0:8388
```

# 错误

```
AttributeError: /lib64/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup
```

以前在openssl，有`EVP_CIPHER_CTX_cleanup`函数.1.1.0版本中替换成为`EVP_CIPHER_CTX_reset`

解决办法：找到报错的文件(注意:根据你的python版本修改,看报错信息中使用的openssl文件)

`vim /usr/local/lib/python2.7/dist-packages/shadowsocks/crypto/openssl.py`

全文搜索cleanup将所有`EVP_CIPHER_CTX_cleanup`替换成为`EVP_CIPHER_CTX_reset`

```
:%s/cleanup/reset/

:x
```
