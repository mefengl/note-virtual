/**
 * 一个 TypeScript 类型工具，用于阻止类型推断。
 * 当你希望函数的参数类型严格基于传入的类型，而不是被泛型参数推断时使用。
 * Example: `function process<T>(value: T, handler: (arg: NoInfer<T>) => void) { ... }`
 * 在这个例子中，`handler` 的 `arg` 类型会严格等于 `value` 的类型，而不会被 `T` 推断影响。
 */
export type NoInfer<A extends any> = [A][A extends any ? 0 : never]

/**
 * 一个 TypeScript 类型工具，用于将对象 `T` 中的部分属性 `K` 变为可选的。
 * `Omit<T, K>`: 从 `T` 中移除属性 `K`。
 * `Partial<Pick<T, K>>`: 选取 `T` 中的属性 `K` 并将它们变为可选的。
 * `&`: 将两者合并，得到一个 `K` 属性可选，其他属性不变的新类型。
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 带记忆（缓存）功能的函数包装器，类似于 React.useMemo。
 * 它会记住上一次计算的结果，只有当依赖项数组 `deps` 发生变化时才重新计算。
 *
 * @template TDeps - 依赖项数组的类型。
 * @template TResult - 计算结果的类型。
 * @param getDeps - 一个返回当前依赖项数组的函数。
 * @param fn - 当依赖项变化时执行的计算函数。
 * @param opts - 配置选项:
 *   - `key`: 用于调试日志的唯一标识符，设为 `false` 可禁用日志。
 *   - `debug`: 一个返回布尔值的函数，用于动态控制是否输出调试信息。
 *   - `onChange`: 当计算结果变化时触发的回调函数。
 *   - `initialDeps`: 初始的依赖项数组。
 * @returns 一个记忆化的函数，调用它会返回缓存的或新计算的结果。
 */
export function memo<TDeps extends ReadonlyArray<any>, TResult>(
  getDeps: () => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    key: false | string
    debug?: () => boolean
    onChange?: (result: TResult) => void
    initialDeps?: TDeps
  },
) {
  // 存储上一次的依赖项
  let deps = opts.initialDeps ?? []
  // 存储上一次的计算结果
  let result: TResult | undefined

  function memoizedFunction(): TResult {
    let depTime: number
    // 如果启用了调试和 key，记录获取依赖项的开始时间
    if (opts.key && opts.debug?.()) depTime = Date.now()

    // 获取新的依赖项
    const newDeps = getDeps()

    // 比较新旧依赖项是否发生变化
    const depsChanged =
      newDeps.length !== deps.length || // 长度是否变化
      newDeps.some((dep: any, index: number) => deps[index] !== dep) // 或者某个依赖项的值是否变化 (浅比较)

    // 如果依赖项没有变化，直接返回缓存的结果
    if (!depsChanged) {
      return result!
    }

    // 更新依赖项
    deps = newDeps

    let resultTime: number
    // 如果启用了调试和 key，记录计算结果的开始时间
    if (opts.key && opts.debug?.()) resultTime = Date.now()

    // 执行计算函数，获取新结果
    result = fn(...newDeps)

    // 如果启用了调试和 key，打印性能信息
    if (opts.key && opts.debug?.()) {
      const depEndTime = Math.round((Date.now() - depTime!) * 100) / 100 // 计算获取依赖项耗时
      const resultEndTime = Math.round((Date.now() - resultTime!) * 100) / 100 // 计算函数执行耗时
      const resultFpsPercentage = resultEndTime / 16 // 计算耗时占 16ms (约 60fps 一帧的时间) 的百分比

      // 格式化输出字符串的辅助函数
      const pad = (str: number | string, num: number) => {
        str = String(str)
        while (str.length < num) {
          str = ' ' + str
        }
        return str
      }

      // 打印调试信息，颜色根据耗时百分比变化 (越红表示性能越差)
      console.info(
        `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
              0,
              Math.min(120 - 120 * resultFpsPercentage, 120), // 色相从 120 (绿色) 向 0 (红色) 变化
            )}deg 100% 31%);`,
        opts?.key, // 打印 key
      )
    }

    // 如果提供了 onChange 回调，则在结果变化时调用它
    opts?.onChange?.(result)

    // 返回新的计算结果
    return result
  }

  // 在记忆化函数上附加一个方法，允许外部直接更新依赖项状态
  // (注意：这通常不推荐，因为它破坏了 memo 的自动依赖跟踪)
  memoizedFunction.updateDeps = (newDeps: [...TDeps]) => {
    deps = newDeps
  }

  return memoizedFunction
}

/**
 * 断言一个值不是 undefined。
 * 如果值是 undefined，则抛出一个错误。
 * 用于 TypeScript 无法自动推断出值非空的场景。
 *
 * @param value 要检查的值。
 * @param msg 可选的错误消息后缀。
 * @returns 如果值不是 undefined，则返回原值。
 * @throws Error 如果值是 undefined。
 */
export function notUndefined<T>(value: T | undefined, msg?: string): T {
  if (value === undefined) {
    throw new Error(`Unexpected undefined${msg ? `: ${msg}` : ''}`)
  } else {
    return value
  }
}

/**
 * 检查两个数字是否近似相等。
 * 考虑到 JavaScript 浮点数精度问题，直接比较可能不准确。
 * 如果两个数字的差的绝对值小于 1，则认为它们近似相等。
 *
 * @param a 第一个数字。
 * @param b 第二个数字。
 * @returns 如果两个数字近似相等，返回 true，否则返回 false。
 */
export const approxEqual = (a: number, b: number) => Math.abs(a - b) < 1

/**
 * 创建一个防抖函数。
 * 防抖意味着在一定时间内，如果函数被连续触发，只有最后一次触发会实际执行。
 * 常用于处理 resize、scroll、input 等频繁触发的事件。
 *
 * @param targetWindow 目标 window 对象 (用于 clearTimeout 和 setTimeout)。
 * @param fn 要进行防抖处理的函数。
 * @param ms 防抖的延迟时间（毫秒）。
 * @returns 一个防抖处理后的新函数。
 */
export const debounce = (
  targetWindow: Window & typeof globalThis,
  fn: Function,
  ms: number,
) => {
  let timeoutId: number | undefined // NodeJS.Timeout in Node, number in Browser

  return function (this: any, ...args: Array<any>) {
    // 清除上一次的定时器（如果存在）
    if (timeoutId !== undefined) {
      targetWindow.clearTimeout(timeoutId as number)
    }
    // 设置新的定时器，延迟执行 fn
    timeoutId = targetWindow.setTimeout(() => {
      fn.apply(this, args) // 使用 apply 保留原始的 this 上下文和参数
      timeoutId = undefined // 执行后重置 timeoutId
    }, ms)
  }
}
