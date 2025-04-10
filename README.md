# Cli工具打包进Electron客户端

## Cli打包

> 目前仅可打包支持esm的包, 如sharp这种c++包还在研究中

1. 安装`bun`
2. 打包到指定平台

具体请看官方文档: [支持的平台参数](https://bun.sh/docs/bundler/executables)

```bash
RUNTIME_ENV=electron bun build ./src/index.js --compile --target=bun-darwin-arm64 --env inline  --outfile z-cli
RUNTIME_ENV=electron bun build ./src/index.js --compile --target=bun-windows-x64 --env inline  --outfile z-cli
```

RUNTIME_ENV 的用途是兼容 cli里的一些和 electron 无关的代码, 如检测 package.json 中信息, 打包后就不存在package.json 了, 所以原项目中使用此环境变量过滤一下

## Electron 配置

### resource/bin

把打包后的二进制文件放在此目录下

