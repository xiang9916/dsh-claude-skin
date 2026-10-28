# dsh-claude-skin

> **Claude 风格的 DSH Web 界面皮肤**：暖黑画布、陶橙点缀，内置 Anthropic 字体切换，跟随原生亮/暗主题。  
> fork 自 [`PAKIKNOWLEDGE/dsh-client-ui-skin-claude`](https://github.com/PAKIKNOWLEDGE/dsh-client-ui-skin-claude)（MIT）

**关于本仓库**：这是 `xiang9916` 的个人 fork，包名与插件身份已调整为 `dsh-claude-skin`，样式与功能与上游保持一致，方便作为自己的皮肤基底继续改造。本仓库已清空上游 Git 历史，从单一初始提交开始独立演进；首个发布版本号沿用上游的 `0.2.1`。

![暗色](docs/dark.png) · ![亮色](docs/light.png)

## 特性

- 暖黑（#141413）画布 + Anthropic 陶橙（#d97757）点缀
- 字体模式：
  - **Anthropic 原生（默认）**：UI 用 Anthropic Sans，对话正文用 Anthropic Serif，代码用 Anthropic Mono
  - **皮肤衬线**：保留原来的衬线 UI 风格
  - **系统默认**：不覆盖 DSH 字体
- 字体设置位于侧栏 **插件** → **Claude 风味主题** 页面，不再占用 设置 → 常规
- 中文正文自动落到 **I.Ming（一點明體）**（含新对话空态的「探索未至之境」标题与「预览版」徽章），西文仍是 Anthropic Serif，中英混排各用其长
- 正文链接、文件 / 命令 / 技能引用、文件类型图标（含计划卡 MD 图标）与「深度求索中」状态统一为陶橙
- 代码块、行内代码、菜单等冷灰面暖色化；语法高亮使用 Claude 语法色（陶橙 / 橄榄 / 琥珀 / 薰衣草）
- 细滚动条、陶橙选中 / 焦点、胶囊徽章
- 亮 / 暗双主题，跟随系统切换

## 字体

> **重要：npm 包不随包分发字体文件。** 字体文件放在仓库 [`fonts/`](fonts/) 供下载；安装后刷新 / 重启 web 才会生效。

| 字体 | 用途 | 文件 |
|---|---|---|
| Anthropic Sans Web Text | 界面 / UI | [`fonts/AnthropicSansWebText.ttf`](fonts/AnthropicSansWebText.ttf) |
| Anthropic Serif Web Text | 对话正文 / Markdown | [`fonts/AnthropicSerifWebText.ttf`](fonts/AnthropicSerifWebText.ttf) |
| Anthropic Mono Variable | 代码 / 代码块 | [`fonts/AnthropicMonoVariable.ttf`](fonts/AnthropicMonoVariable.ttf) |
| I.Ming（一點明體）8.10 | 中文正文 / 标题 / 表格 / 新对话空态标题与「预览版」徽章 | 不随仓库分发，用 [`scripts/install-iming.sh`](scripts/install-iming.sh) 下载安装 |

安装：Windows 双击 `.ttf` → 「安装」；macOS 用「字体册」导入。安装后刷新页面生效。

> 字体版权归 Anthropic 所有，仅供个人使用，不适用 MIT 许可（详见 [LICENSE](LICENSE) 字体声明）。

### 中文正文：一點明體（I.Ming）

对话正文的衬线字族是这样排列的：

```css
--dsw-font-serif:
  "Anthropic Serif Web Text", Georgia, "Times New Roman",
  "I.Ming", "一點明體",          /* ← 中文落到这里 */
  "Noto Serif SC", "Songti SC", serif;
```

Anthropic Serif 不含汉字，所以**西文用 Anthropic Serif、汉字用 I.Ming**，浏览器按字形逐个回退，无需拆段。`skin`（皮肤衬线）模式同样会落到 I.Ming。

新对话空态的两处文字原本到不了 I.Ming：「探索未至之境」大标题继承的是 UI 无衬线字族，「预览版」徽章则被应用钉在等宽字族。皮肤用一条规则把两者指回 `--dsw-font-serif`，因此 anthropic / skin 模式下它们与正文一样是明体；「系统默认」模式则保持不干预字体。这两处同时按 `font-weight: 700` 加粗，明体只有常规字重，粗体由浏览器合成。

I.Ming 体积约 25 MB（60017 个码位，含 Big5、GB2312、《通用规范汉字表》），故**不提交进仓库**，改用脚本从官方 Release 下载并校验 SHA-256：

```sh
./scripts/install-iming.sh
```

- macOS → `~/Library/Fonts/I.Ming-8.10.ttf`；Linux → `~/.local/share/fonts/`（自动 `fc-cache`）
- Windows：脚本只提示下载地址，双击 `.ttf` → 「安装」即可
- 验证：macOS 里 `system_profiler SPFontsDataType | grep I.Ming` 应能查到

> I.Ming 由一點字坊（I.Font Project）制作，采用 [IPA 开放字型授权协议 1.0](https://github.com/ichitenfont/I.Ming/blob/master/8.10/IPA_Font_License_Agreement_v1.0_chi.md)，**不适用 MIT**；本仓库只引用字体名、不分发字体文件。

## 安装

已发布到 npm：稳定版 [`0.2.1`](https://www.npmjs.com/package/dsh-claude-skin) 对应 DSH 0.2.1-rc.2；预发布版 `0.2.1-rc.4`（dist-tag `next`）适配 **DSH 0.2.1-rc.2 / rc.3 / rc.4 与 0.2.2-alpha.2**，并把字体设置挪到了插件页。推荐直接安装：

```sh
dsh plugin --profile web add dsh-claude-skin         # 0.2.1（旧版字体设置位置）
dsh plugin --profile web add dsh-claude-skin@next    # 0.2.1-rc.4，适配 0.2.1-rc.4 / 0.2.2-alpha.2
```

也可以从源码 / tgz 安装：

### 1. 打包为 tgz 后安装

在仓库根目录执行：

```sh
npm pack
# 生成 dsh-claude-skin-<version>.tgz
dsh plugin --profile web add ./dsh-claude-skin-*.tgz
dsh web
```

- 未全局安装 `dsh` CLI：把 `dsh` 换成 `npx @deepseek-ai/dsh`。

### 2. DSH Desktop 桌面端

打开侧栏的 **插件** 面板，点 **添加插件**，把上面生成的 tgz 绝对路径粘贴到安装输入框即可（旧版 DSH 在 设置 → 插件）。

### 3. 从 GitHub 安装（推送本仓库后可用）

```sh
dsh plugin --profile web add github:xiang9916/dsh-claude-skin
```

装完重启 `dsh web`，刷新页面。

> **插件列表显示名与图标**：安装后在插件页的「已安装插件」里显示为 **「Claude 风味主题」**，图标是陶土橙鲸鱼。名称来自 [`locale/zh.json`](locale/zh.json) 的 `meta.title`，英文环境显示 `Claude Flavour Theme`；图标由 [`package.json`](package.json) 的 `"icon": "./icon.svg"` 指向 [`icon.svg`](icon.svg)。

> **装完看不到 Anthropic 字体是正常的**：npm 包不随包分发字体，需要手动导入 [`fonts/`](fonts/) 里的三个 TTF；想让中文正文用一點明體，再执行一次 `./scripts/install-iming.sh`。

## 兼容性

| 本插件版本 | 适配的 DSH | 说明 |
| --- | --- | --- |
| `0.2.1` | 0.2.1-rc.2 | 字体设置在「设置 → 常规」 |
| `0.2.1-rc.3` | 0.2.1-rc.3 | 字体设置迁至「插件」面板 |
| `0.2.1-rc.4`（`next`） | 0.2.1-rc.2 / rc.3 / rc.4 / 0.2.2-alpha.2 | 当前版本 |

适配方式：逐版核对客户端插槽契约（`plugins.bundle.config` 的 keyed 注册、`view: 'page'`、按 npm 包名查 ledger）、模块表（`react`、`react/jsx-runtime`、`@deepseek-ai/dsh-client-store`、`@deepseek-ai/dsh-client-ui-primitives`）、`dsh.client.platform === 'web'` 的清单校验、`window.__ModuleLoader__.load({id, factory})` 手写包格式、`data-ds-dark-theme` / `data-slot` / `data-plugin-config` 等 DOM 锚点与皮肤用到的全部类名，以及主题 token：rc.4 的 token 集与 rc.3 完全一致，alpha.2 只删了未被使用的 `--dsw-specific-sidebar-nav-item-hover`，并新增 `--dsw-alias-illustration-*` 等插图 token（本版已改映射为暖中性色）。`package.json` 用 `engines.dsh`（宿主按 `includePrerelease` 参与比较）与 `dsh.compatibility.dshReleases` 声明兼容范围。

## 切换字体

打开侧栏 **插件** → 已安装插件 → **Claude 风味主题**，在配置区找到 **字体风格**：

- **Anthropic 原生（默认）**：Sans UI / Serif 正文（汉字 I.Ming）/ Mono 代码
- **皮肤衬线**：Georgia 等衬线 UI，汉字同样用 I.Ming
- **系统默认**：保持 DSH 默认字体

选择立即生效，并保存在浏览器 localStorage。设置 → 常规 不再显示这一行。

> 如果之前单独安装过 `dsh-anthropic-fonts`，建议先卸载，避免两套字体变量互相覆盖。

## 切换皮肤

同一时刻只启用一个皮肤。本 fork 使用独立的 loader 行 id **`ui-claude-skin`**（上游是 `ui-skin-claude`），`skin.json` 的皮肤 id 也改为 `claude-skin`，因此不会与上游包发生 loader id 冲突；但两个皮肤都会写入同一个 `data-dsh-claude` 作用域并各自注入一份 `<style>`，**不要同时启用**，否则后加载的会覆盖前一个的样式。

编辑 `~/.dsh/cordis.patch.yml`：

```yaml
# dsh-skin managed 段之外
- insert:
    - id: ui-claude-skin
      name: 'dsh-claude-skin'
```

（并把当前启用皮肤的 `disabled: true` 加上。）配置 watcher 几秒内热加载，刷新页面生效。

## 卸载

1. 删除 `~/.dsh/cordis.patch.yml` 里的 `ui-claude-skin` insert 行
2. `dsh plugin --profile web remove dsh-claude-skin`
3. 重启 `dsh web`

## 许可

MIT。上游版权与作者署名保留在 [LICENSE](LICENSE) 中；Anthropic 字体版权归 Anthropic，I.Ming 采用 IPA 开放字型授权协议 1.0，均不适用 MIT。
