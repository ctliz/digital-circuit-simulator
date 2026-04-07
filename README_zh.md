# 数字电路模拟器

一个基于 Web 的交互式数字电路模拟器，支持拖拽放置逻辑门、实时信号传播仿真、时序电路设计。

[English](./README.md) | [简体中文](./README_zh.md)

---

## 特性

### 逻辑门
- **基础门**: 与门(AND)、或门(OR)、非门(NOT)、与非门(NAND)、或非门(NOR)、异或门(XOR)、同或门(XNOR)

### 输入输出
- **INPUT**: 可切换 0/1 状态的输入节点
- **OUTPUT**: 显示结果的输出节点

### 时序电路
- **D 触发器**: 带时钟输入和 Q/Q̄ 输出
- **4位寄存器**: 带使能加载功能
- **时钟源**: 可配置频率的振荡信号发生器 (0.1-10 Hz)

### 仿真功能
- 实时信号传播
- 可配置时钟频率
- 时钟周期计数器
- 开始/暂停控制

### 交互界面
- 拖拽放置组件
- 节点连接（通过 handles）
- 小地图和导航控件
- 属性面板（节点编辑）
- 信号监控面板
- 新手教程引导

---

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Zustand | 状态管理 |
| ReactFlow | 节点编辑器 |
| Lucide React | 图标库 |

---

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 安装

```bash
git clone https://github.com/yourusername/digital-circuit-simulator.git
cd digital-circuit-simulator
npm install
```

### 开发

```bash
npm run dev
```

访问 http://localhost:5173 查看运行效果。

### 构建

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

---

## 使用指南

### 基本操作

1. **添加组件**: 点击工具栏中的组件类型，然后在画布上点击放置
2. **连接组件**: 拖拽一个节点的输出连接到另一个节点的输入
3. **编辑属性**: 点击组件查看/编辑属性
4. **删除组件**: 选中组件后按 Delete 键或点击删除按钮
5. **运行仿真**: 点击工具栏的"运行"按钮启动仿真
6. **调整频率**: 在控制面板中调整时钟频率

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| Delete | 删除选中组件 |
| Space | 开始/暂停仿真 |
| +/- | 调整缩放 |

---

## 项目结构

```
digital-circuit-simulator/
├── public/
│   └── icons.svg          # 图标资源
├── src/
│   ├── components/        # React 组件
│   │   ├── Canvas.tsx         # 主画布 (ReactFlow)
│   │   ├── MonitorPanel.tsx    # 信号监控面板
│   │   ├── PropertiesPanel.tsx # 属性编辑面板
│   │   ├── Toolbar.tsx         # 工具栏
│   │   └── Tutorial.tsx        # 教程引导
│   ├── i18n/               # 国际化
│   │   ├── index.tsx           # i18n 上下文
│   │   ├── en.json             # 英文翻译
│   │   └── zh.json             # 中文翻译
│   ├── logic/              # 核心逻辑
│   │   ├── circuitEngine.ts    # 电路求值引擎
│   │   └── gateDefinitions.ts   # 门定义
│   ├── store/              # 状态管理
│   │   └── circuitStore.ts     # Zustand store
│   ├── types/              # TypeScript 类型
│   │   └── circuit.ts
│   ├── App.tsx             # 根组件
│   └── main.tsx           # 入口文件
├── index.html
├── package.json
└── vite.config.ts
```

---

## 工作原理

1. 用户点击"运行"启动仿真
2. 时钟节点按配置频率切换状态
3. `evaluateCombinationalCircuit()` 计算所有节点输出
4. 时序元件（触发器、寄存器）在时钟边沿更新
5. UI 实时反映更新后的状态

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 许可证

MIT License
