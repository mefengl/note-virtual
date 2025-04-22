// @ts-check
// 这是一条特殊的 JSDoc 注释，用于告知 Visual Studio Code 等编辑器
// 对这个 JavaScript 文件启用 TypeScript 的类型检查。
// 这有助于在编写配置时捕获潜在的类型错误。

// 导入 TanStack 提供的基础 ESLint 配置。
// TanStack (著名的 React Query, React Table 等库的开发者) 可能提供了一套
// 推荐的 ESLint 规则集，封装在 @tanstack/config 包中。
import { tanstackConfig } from '@tanstack/config/eslint'

// ESLint 的 "flat config" 格式要求默认导出一个配置对象的数组。
// 每个对象代表一层配置，后面的配置可以覆盖或补充前面的配置。
export default [
  // 使用 JavaScript 的扩展运算符 (...) 将导入的 tanstackConfig 数组中的所有配置对象
  // 添加到我们最终导出的配置数组中。这表示我们首先应用 TanStack 的基础规则。
  ...tanstackConfig,

  // 这里定义了一个自定义的配置对象，用于覆盖或添加特定的规则。
  {
    // 'name' 字段为这个配置块提供一个唯一的名称，主要用于调试和区分不同的配置来源。
    name: 'tanstack/temp', // 'temp' 可能暗示这些是临时性的规则调整

    // 'rules' 对象用于指定要启用、禁用或修改的 ESLint 规则。
    rules: {
      // '@typescript-eslint/naming-convention': 'off'
      // 禁用了 @typescript-eslint 插件提供的命名规范规则。
      // 这条规则通常强制变量、函数、类、接口等的命名风格 (例如 camelCase, PascalCase)。
      // 暂时禁用可能是因为项目中有特殊命名习惯或正在进行重构。
      '@typescript-eslint/naming-convention': 'off',

      // '@typescript-eslint/no-unnecessary-condition': 'off'
      // 禁用了 @typescript-eslint 插件提供的检查不必要条件的规则。
      // 这条规则会警告那些总是为真或总是为假的条件语句 (例如 `if (true)` 或 `while (false)`),
      // 以及在类型保护后仍然进行空值检查的情况。
      // 禁用可能是在处理某些已知总是满足或不满足的条件，或者规则产生了误报。
      '@typescript-eslint/no-unnecessary-condition': 'off',

      // '@typescript-eslint/no-unsafe-function-type': 'off'
      // 禁用了 @typescript-eslint 插件提供的禁止使用不安全的 Function 类型的规则。
      // 直接使用 `Function` 类型会丢失参数和返回值的类型信息，降低类型安全性。
      // 禁用此规则可能是项目中确实需要处理非常通用的函数类型，或者存在一些难以解决的类型兼容问题。
      '@typescript-eslint/no-unsafe-function-type': 'off',

      // 'no-self-assign': 'off'
      // 禁用了 ESLint 核心规则中禁止变量自我赋值的规则 (例如 `x = x;`)。
      // 这种赋值通常是无意义的，可能是笔误。
      // 禁用它可能是因为某些特殊代码模式，或者开发者认为这个检查过于严格。
      'no-self-assign': 'off',
    },
  },
]
