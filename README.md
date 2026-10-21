# dsh-worktable（工作台 / Worktable）

DSH 侧边栏插件：在左侧边栏**工作区下方**增加一级入口「工作台 / Worktable」，样式与操作逻辑对齐自带工作区分区。

当前版本（v0.1.0）只实现入口本身：

- 位于 `sidebar.footer.action`（侧边栏底部、设置行上方，即工作区列表下方）。
- 左侧显示本地化标题「工作台 / Worktable」，右侧是与工作区一致的「添加工作台 / Add worktable」图标按钮。
- 点击入口主体展开 / 收起工作台列表；展开后尚无项目时显示「空 / Empty」。
- 标题、添加按钮提示、展开/收起提示、空状态文案全部通过 Client locale 服务注册，跟随 DSH 语言设置实时切换（简体中文 / English）。
- 侧边栏收起为 56px 导轨时隐藏该分区；主题只使用 `--dsw-alias-*` token，深色 / 浅色一致。

「添加工作台」按钮的行为（创建、命名、持久化工作台项目）属于下一步，当前点击不会新增项目。

## 目录结构

```text
dsh-worktable/
├── package.json        # bundle 清单：dsh.bundle.patch + dsh.client
├── cordis.patch.yml    # 插入 worktable 插件行
├── index.js            # Host 半：空实现（入口完全在浏览器侧）
├── client.js           # 浏览器半：注册 locale 字典与 sidebar.footer.action 入口
├── locale/en.json      # 插件管理页展示的英文标题与描述
├── locale/zh.json      # 插件管理页展示的中文标题与描述
├── icon.svg            # 插件图标（原创）
└── README.md
```

## 安装

本插件是一个 DSH bundle，安装时以本目录为 target 执行 `plugin_manager` 的 `install_bundle`（可让 agent 代劳），随后刷新页面即可，无需重启应用。

卸载使用 `plugin_manager` 的 `remove_bundle`。

## 开发

无构建步骤，`client.js` 就是运行产物：

```bash
node --check client.js
```

修改 `client.js` 后重新安装 / 刷新页面查看效果。

## 设计说明

- **落点**：`sidebar` 的工作区浏览区是单个 `single` slot（由 ui-workspace 整体占用），没有可追加的列表座位；其下方唯一的列表座位是 `sidebar.footer.action`，因此入口注册在这里，视觉上正好位于工作区列表与设置行之间。
- **样式**：复刻自带工作区分区头部（36px 行高、`--dsw-radius-md`、tertiary 标签色、28px 图标按钮与 hover 底色），不读取其他插件的 DOM 或样式表。
- **本地化**：`ctx.locale.register('dsh-worktable', { zh, en })` 注册字典，slot 注册时传 `locale: 'dsh-worktable'`，组件从注入的 `t` 取文案；`locale/*.json` 只负责插件管理页的标题与描述。
