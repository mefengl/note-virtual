import * as React from 'react' // 导入 React 库
import { flushSync } from 'react-dom' // 导入 react-dom 的 flushSync，用于同步更新 DOM
import {
  Virtualizer, // 导入核心的 Virtualizer 类
  elementScroll, // 导入用于元素滚动的 scrollToFn 实现
  observeElementOffset, // 导入观察元素滚动偏移的函数
  observeElementRect, // 导入观察元素尺寸的函数
  observeWindowOffset, // 导入观察窗口滚动偏移的函数
  observeWindowRect, // 导入观察窗口尺寸的函数
  windowScroll, // 导入用于窗口滚动的 scrollToFn 实现
} from '@tanstack/virtual-core' // 从核心库导入
import type { PartialKeys, VirtualizerOptions } from '@tanstack/virtual-core' // 导入核心库的类型定义

// 重新导出所有来自核心库的内容，这样使用者可以直接从 react-virtual 导入
export * from '@tanstack/virtual-core'

/**
 * 同构的 useLayoutEffect。
 * 在浏览器环境，它就是 React.useLayoutEffect，在 DOM 更新后同步触发，避免闪烁。
 * 在服务器端渲染 (SSR) 等没有 document 的环境，它回退到 React.useEffect，避免报错。
 */
const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect

/**
 * 基础的 React Hook，用于创建和管理 Virtualizer 实例。
 * 它是 useVirtualizer 和 useWindowVirtualizer 的内部实现。
 *
 * @template TScrollElement - 滚动容器元素的类型，可以是 Element 或 Window。
 * @template TItemElement - 列表项元素的类型。
 * @param options - Virtualizer 的配置选项。
 * @returns 返回 Virtualizer 的实例。
 */
function useVirtualizerBase<
  TScrollElement extends Element | Window,
  TItemElement extends Element,
>(
  options: VirtualizerOptions<TScrollElement, TItemElement>,
): Virtualizer<TScrollElement, TItemElement> {
  // 使用 useReducer 创建一个强制重新渲染的函数 rerender
  // 当 Virtualizer 内部状态变化需要更新 React 组件时调用
  const rerender = React.useReducer(() => ({}), {})[1]

  // 解析最终的配置选项
  const resolvedOptions: VirtualizerOptions<TScrollElement, TItemElement> = {
    ...options, // 继承传入的选项
    // 重写 onChange 回调
    onChange: (instance, sync) => {
      // 当 Virtualizer 实例状态变更时
      if (sync) {
        // 如果需要同步更新 (例如，滚动位置可能需要立即反应以避免跳动)
        // 使用 flushSync 来确保 React 同步执行状态更新和 DOM 渲染
        flushSync(rerender)
      } else {
        // 否则，进行常规的异步状态更新
        rerender()
      }
      // 调用用户传入的原始 onChange 回调 (如果存在)
      options.onChange?.(instance, sync)
    },
  }

  // 使用 useState 创建并持有 Virtualizer 实例
  // 初始值通过函数创建，确保只创建一次
  const [instance] = React.useState(
    () => new Virtualizer<TScrollElement, TItemElement>(resolvedOptions),
  )

  // 每次渲染时，使用最新的配置更新 Virtualizer 实例
  // 这确保了即使配置项动态变化，Virtualizer 也能获取到最新值
  instance.setOptions(resolvedOptions)

  // 使用同构的 useLayoutEffect 处理挂载逻辑
  useIsomorphicLayoutEffect(() => {
    // 调用实例的内部挂载方法，通常用于启动事件监听等
    // 返回一个清理函数，在组件卸载时调用
    return instance._didMount()
  }, []) // 空依赖数组表示只在挂载时执行一次

  // 使用同构的 useLayoutEffect 处理更新前的逻辑
  useIsomorphicLayoutEffect(() => {
    // 调用实例的内部更新方法，通常用于在渲染前进行必要的测量或计算
    // 返回一个清理函数，在下一次 effect 执行前或组件卸载时调用
    return instance._willUpdate()
  }) // 没有依赖数组表示每次渲染后都执行

  // 返回创建好的 Virtualizer 实例
  return instance
}

/**
 * 用于普通 HTML 元素滚动的 React Hook。
 * 它封装了 useVirtualizerBase，并为 Element 滚动提供了默认的配置。
 *
 * @template TScrollElement - 滚动容器元素的类型 (必须是 Element 的子类)。
 * @template TItemElement - 列表项元素的类型。
 * @param options - Virtualizer 的配置选项，部分选项 (如 observeElementRect) 是可选的，因为 Hook 提供了默认值。
 * @returns 返回配置好的 Virtualizer 实例。
 */
export function useVirtualizer<
  TScrollElement extends Element,
  TItemElement extends Element,
>(
  options: PartialKeys<
    VirtualizerOptions<TScrollElement, TItemElement>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn' // 这些属性变为可选
  >,
): Virtualizer<TScrollElement, TItemElement> {
  // 调用基础 Hook，并传入针对 Element 滚动的默认实现
  return useVirtualizerBase<TScrollElement, TItemElement>({
    observeElementRect: observeElementRect, // 使用核心库提供的元素尺寸观察器
    observeElementOffset: observeElementOffset, // 使用核心库提供的元素偏移观察器
    scrollToFn: elementScroll, // 使用核心库提供的元素滚动函数
    ...options, // 合并用户传入的选项
  })
}

/**
 * 用于 Window 滚动的 React Hook。
 * 它封装了 useVirtualizerBase，并为 Window 滚动提供了默认的配置。
 *
 * @template TItemElement - 列表项元素的类型。
 * @param options - Virtualizer 的配置选项，部分选项 (如 getScrollElement) 是可选的，因为 Hook 提供了默认值。
 * @returns 返回配置好的 Virtualizer 实例。
 */
export function useWindowVirtualizer<TItemElement extends Element>(
  options: PartialKeys<
    VirtualizerOptions<Window, TItemElement>,
    |
      'getScrollElement' |
      'observeElementRect' |
      'observeElementOffset' |
      'scrollToFn' // 这些属性变为可选
  >,
): Virtualizer<Window, TItemElement> {
  // 调用基础 Hook，并传入针对 Window 滚动的默认实现
  return useVirtualizerBase<Window, TItemElement>({
    // 默认获取 window 作为滚动元素 (仅在浏览器环境)
    getScrollElement: () => (typeof document !== 'undefined' ? window : null),
    observeElementRect: observeWindowRect, // 使用核心库提供的窗口尺寸观察器
    observeElementOffset: observeWindowOffset, // 使用核心库提供的窗口偏移观察器
    scrollToFn: windowScroll, // 使用核心库提供的窗口滚动函数
    // 默认初始偏移量为当前窗口的滚动 Y 值 (仅在浏览器环境)
    initialOffset: () => (typeof document !== 'undefined' ? window.scrollY : 0),
    ...options, // 合并用户传入的选项
  })
}
