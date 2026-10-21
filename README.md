# dsh-worktable（工作台 / Worktable）

DSH 侧边栏插件：在左侧边栏主体内、**工作区下方**增加一个与工作区同级的「工作台 / Worktable」分区。工作区与工作台各占侧边栏主体高度的一半，各自独立滚动。

当前版本（v0.1.0）只实现分区本身：

- 位于工作区列表下方、设置行上方；与工作区上下对分侧边栏主体高度。
- 顶部是静态分区头：左侧本地化标题「工作台 / Worktable」，右侧是与工作区一致的「添加工作台 / Add worktable」图标按钮；**没有展开 / 收起交互**。
- 列表区始终显示；尚无工作台项目时，在列表区中央显示「空 / Empty」。
- 标题、添加按钮提示、空状态文案全部通过 Client locale 服务注册，跟随 DSH 语言设置实时切换（简体中文 / English）。
- 侧边栏收起为 56px 导轨时隐藏该分区；主题只使用 `--dsw-alias-*` token，深色 / 浅色一致。

「添加工作台」按钮的行为（创建、命名、持久化工作台项目）属于下一步，当前点击不会新增项目。

![侧边栏工作台分区](docs/sidebar-entry.png)

（实际运行截图：上半为工作区，下半为工作台，空态居中显示。）

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
├── docs/               # 实际运行截图
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

- **结构限制**：侧边栏主体是 `sidebar.workspaces` 这个 `single` slot（由 ui-workspace 的 WorkspaceBrowser 整体占用），ui-sidebar 没有提供“主体内同级分区列表”的座位。因此工作台只能先注册到工作区下方唯一的列表座位 `sidebar.footer.action`。
- **提升为同级分栏**：注册后通过 `display: contents` 把 `sidebar.footer.action` 的宿主容器（footer 动作行与 foot 容器）摊平，让工作台分区在布局上成为侧边栏列的直接子项，与工作区容器平分剩余高度（两者均为 `flex: 1 1 0`）。这是一处针对宿主侧边栏内部结构的 CSS 适配：自带结构变化时会退化为 footer 内条目，不会影响插件加载。
- **附带影响**：摊平只在工作台分区存在时生效；同一 footer 槽位的其它条目（例如会话运行灯条）也会随之成为侧边栏列的直接子项并按整行排列。关闭本插件后立即恢复原状。
- **样式**：复刻自带工作区分区头（36px 行高、tertiary 标签色、28px 图标按钮与 hover 底色），只使用 `--dsw-alias-*` 主题 token，不读取其他插件的 DOM 或样式表。
- **本地化**：`ctx.locale.register('dsh-worktable', { zh, en })` 注册字典，slot 注册时传 `locale: 'dsh-worktable'`，组件从注入的 `t` 取文案；`locale/*.json` 只负责插件管理页的标题与描述。切换语言时 slot 会随 locale revision 重新渲染。
- **收起态**：侧边栏折叠为 56px 导轨时分区不渲染（`wide === false`），摊平规则随之失效，footer 恢复原布局。
- **无障碍**：分区头是普通标题行，列表区是 `role="group"` 并带本地化 `aria-label`；添加按钮有 `aria-label` 与本地化 `title` 提示。
