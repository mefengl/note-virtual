# 代码阅读推荐顺序

了解项目整体结构和核心逻辑的建议阅读顺序：

1. **项目配置与依赖:**
   * [`package.json`](./package.json) - 查看项目整体脚本、依赖和工作区配置。
   * [`pnpm-workspace.yaml`](./pnpm-workspace.yaml) - 了解 pnpm monorepo 的工作区定义。
   * [`tsconfig.json`](./tsconfig.json) - 根 TypeScript 配置。
   * [`eslint.config.js`](./eslint.config.js) - ESLint 配置。
   * [`prettier.config.js`](./prettier.config.js) - Prettier 配置。
2. **核心虚拟化逻辑:**
   * [`packages/virtual-core/package.json`](./packages/virtual-core/package.json) - 核心包的配置和依赖。
   * [`packages/virtual-core/src/index.ts`](./packages/virtual-core/src/index.ts) - 核心库的入口点，理解 `Virtualizer` 的创建和基本 API。
   * [`packages/virtual-core/src/virtualizer.ts`](./packages/virtual-core/src/virtualizer.ts) - `Virtualizer` 类的主要实现，包含核心计算逻辑。
   * [`packages/virtual-core/src/utils.ts`](./packages/virtual-core/src/utils.ts) - 核心库使用的工具函数。
3. **框架适配器 (以 React 为例):**
   * [`packages/react-virtual/package.json`](./packages/react-virtual/package.json) - React 适配器的包配置。
   * [`packages/react-virtual/src/index.tsx`](./packages/react-virtual/src/index.tsx) - React 适配器的入口和主要的 Hook (`useVirtualizer`）。
   * [`packages/react-virtual/src/useVirtualizer.tsx`](./packages/react-virtual/src/useVirtualizer.tsx) - React 适配器的 `useVirtualizer` Hook 实现。
4. **示例应用 (以 React Fixed 为例):**
   * [`examples/react/fixed/package.json`](./examples/react/fixed/package.json) - 固定高度 React 示例的配置。
   * [`examples/react/fixed/src/main.tsx`](./examples/react/fixed/src/main.tsx) - 查看如何在 React 应用中使用 `useVirtualizer` 实现固定高度虚拟列表。
5. **贡献与文档:**
   * [`CONTRIBUTING.md`](./CONTRIBUTING.md) - 贡献指南。
   * [`docs/introduction.md`](./docs/introduction.md) - 项目介绍文档。
   * [`docs/api/virtualizer.md`](./docs/api/virtualizer.md) - Virtualizer API 文档。

---

![TanStack Virtual Header Image](https://github.com/TanStack/virtual/raw/main/media/header.png "TanStack Virtual Header Image")

Headless UI for virtualizing scrollable elements in TS/JS and React

<a href="https://twitter.com/intent/tweet?button_hashtag=TanStack" target="_parent">
  <img alt="#TanStack" src="https://img.shields.io/twitter/url?color=%2308a0e9&label=%23TanStack&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ftweet%3Fbutton_hashtag%3DTanStack" />
</a><a href="https://github.com/TanStack/virtual/actions/workflows/ci.yml">
<img src="https://github.com/tanstack/virtual/actions/workflows/ci.yml/badge.svg" alt="CI Workflow" />
</a><a href="https://npmjs.com/package/@tanstack/virtual-core" target="_parent">
  <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/@tanstack/virtual-core.svg" />
</a><a href="https://bundlephobia.com/result?p=@tanstack/virtual@latest" target="_parent">
  <img alt="Bundlephobia Minzipped Size" src="https://badgen.net/bundlephobia/minzip/@tanstack/virtual@latest" />
</a><a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a><a href="https://github.com/tanstack/virtual/discussions">
  <img alt="Join the discussion on Github" src="https://img.shields.io/badge/Github%20Discussions%20%26%20Support-Chat%20now-blue" />
</a><a href="https://github.com/tanstack/virtual" target="_parent">
  <img alt="GitHub Stars" src="https://img.shields.io/github/stars/tanstack/virtual.svg?style=social&label=Star" />
</a><a href="https://twitter.com/tannerlinsley" target="_parent">
  <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/tannerlinsley.svg?style=social&label=Follow" />
</a>

<br />
<br />

Enjoy this library? Try the entire [TanStack](https://tanstack.com)! [React Query](https://github.com/TanStack/react-query), [TanStack Table](https://github.com/TanStack/table), [React Charts](https://github.com/TanStack/react-charts)

## Visit [tanstack.com/virtual](https://tanstack.com/virtual) for docs, guides, API and more

## Quick Features

* Row, Column, and Grid virtualization
* One single **headless** function
* Fixed, variable and dynamic measurement modes
* Imperative scrollTo control for offset, indices and alignment
* Custom scrolling function support (eg. smooth scroll)

## Check it out

Explore the examples:

* [React](https://tanstack.com/virtual/latest/docs/framework/react/examples)
* [Solid](https://tanstack.com/virtual/latest/docs/framework/solid/examples)
* [Vue](https://tanstack.com/virtual/latest/docs/framework/vue/examples)
* [Svelte](https://tanstack.com/virtual/latest/docs/framework/svelte/examples)
* [Lit](https://tanstack.com/virtual/latest/docs/framework/lit/examples)
