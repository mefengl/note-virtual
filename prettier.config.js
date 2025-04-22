// @ts-check
// 同样，这条 JSDoc 注释用于启用 TypeScript 类型检查，
// 确保我们的配置对象符合 Prettier 的 Config 类型。

/**
 * 这是 JSDoc 的类型注解，明确指出 `config` 变量的类型是 `import('prettier').Config`。
 * 这提供了更强的类型提示和自动补全功能。
 * `import('prettier').Config` 这种语法是从 `prettier` 包动态导入 `Config` 类型。
 * @type {import('prettier').Config}
 */
const config = {
  // `semi`: 控制是否在语句末尾添加分号。
  // `false` 表示不添加分号 (例如 `const x = 1` 而不是 `const x = 1;`)。
  // 这是一种常见的 JavaScript 代码风格选择。
  semi: false,

  // `singleQuote`: 控制是否使用单引号而不是双引号。
  // `true` 表示强制使用单引号 (例如 `'hello'` 而不是 `"hello"`)。
  // 除非字符串内部包含单引号，此时会用双引号以避免转义。
  singleQuote: true,

  // `trailingComma`: 控制对象、数组等的最后一个元素后面是否添加逗号。
  // `'all'` 表示尽可能在所有允许的地方添加尾随逗号 (包括函数参数)。
  // 这有助于版本控制 diff 更清晰，因为添加或删除最后一个元素不会改变前一行的内容。
  trailingComma: 'all',

  // `plugins`: 加载额外的 Prettier 插件。
  // `prettier-plugin-svelte` 用于让 Prettier 能够格式化 `.svelte` 文件。
  plugins: ['prettier-plugin-svelte'],

  // `overrides`: 允许针对特定的文件模式应用不同的配置选项。
  // 这对于混合代码库或特定文件类型需要特殊处理时很有用。
  overrides: [
    {
      // `files`: 指定要应用这些覆盖选项的文件模式 (glob 模式)。
      // `'*.svelte'` 匹配所有以 `.svelte` 结尾的文件。
      files: '*.svelte',
      // `options`: 在匹配的文件上应用的特定 Prettier 选项。
      options: {
        // `parser`: 指定用于解析这些文件的解析器。
        // `'svelte'` 表示使用 `prettier-plugin-svelte` 提供的解析器来处理 Svelte 文件。
        parser: 'svelte',
      },
    },
  ],
}

// 将配置对象作为模块的默认导出，以便 Prettier CLI 或编辑器集成能够找到并使用它。
export default config
