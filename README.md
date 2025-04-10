# Cli工具集成到Electron客户端

**原CLI须用Bun进行打包为二进制文件, electron中直接使用 child_process.spawn 执行, 监听输出信息返回到前端进行展示** 

前端中需要有一个配置文件 `src/config.ts`, 来表示自己的 `cli` 有哪些 `command` 可以运行

## Cli打包

> 目前仅可打包支持esm的包, 如sharp这种c++包还在研究中

安装`bun`

macos
```bash
curl -fsSL https://bun.sh/install | bash
```

wind
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

打包到指定平台

具体请看官方文档: [支持的平台参数](https://bun.sh/docs/bundler/executables)

```bash
RUNTIME_ENV=electron bun build ./src/index.js --compile --target=bun-darwin-arm64 --env inline  --outfile z-cli
RUNTIME_ENV=electron bun build ./src/index.js --compile --target=bun-windows-x64 --env inline  --outfile z-cli
```

`RUNTIME_ENV` 的用途是兼容 `cli` 里的一些和 `electron` 无关的代码

如检测 `package.json` 中信息, 打包后就不存在 `package.json` 了, 所以原项目中使用此环境变量过滤一下

## Electron 配置

### resource/bin

把打包后的二进制文件放在此目录下

`ipc.ts` 以及 `App.vue` 中修改 `z-cli` 相关字符(binaryName/channel) 为 **自己的cli名称**

## Vue 配置

`src/config.ts` 修改为自己 cli 的命令配置

## 打包/调试

最终构建好的客户端, 包含一行命令的下拉栏, 以及一个执行结果

原本 cli 的配置文件等都会复用 

相当于只是把 cli 的敲命令过程可视化, 把结果照搬到 electron 中

## 注意

注意下 cli 里的依赖,是否兼容 bun

如:
- axios 需要替换成 fetch
- sharp 可能在构建成客户端后会报错 (待解决)