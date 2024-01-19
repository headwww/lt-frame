# lt-frame

## 项目搭建

### Monorepo

项目的依照Monorepo思想搭建的基本框架，包的管理使用的是pnpm的方式，对于一个Monorepo项目使用pnpm有天然的支持，因为Monorepo项目存在很多packages，而这些包在本地需要相互关联、测试、使用。

### pnpm

#### 安装

全局安装pnpm的支持

```sh
npm install pnpm -g
```

#### 初始化项目

不使用脚手架和vite的方式创建项目，新建一个项目文件夹，在项目的根目录执行`pnpm init`指令生成`package.json`文件

```json
{
  "name": "lt-frame",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
}
```

##### 包结构

新建一个packages文件夹后续用来放各种包(components、utils......)。

暂时先做这样一个结构，后续可能会有一定的调整

⚠️注意：`{components, utils,......}/packages.json`里面的name设置成`@lt-frame/对应的包名字` 如 `@lt-frame/utils`

```yaml
ltframe:
  - packages
  	- components
  		- packages.json
  	- utils
  		- packages.json
  	......
  - play
  	- App.vue
  	- index.html
  	- main.ts
  	- packages.json
  	- vite.config.ts
  - packages.json
  - pnpm-workspace.yaml
  - tsconfig.json
```

根目录新建 pnpm 的工作区文件 `pnpm-workspace.yaml`就可以将包进行关联

```yaml
packages:
  - "packages/**"
  - "play"

```

这样就表示 packages 目录下的所有包都被关联了,然后你需要使用packages内部某个包的地方再执行`pnpm add @lt-frame/包名`，执行完之后即可发现该目录下的node_modules出现了另外一个包的软连接

⚠️注意：这里我们使用了 import es6 语法,所以我们要在各个包的`package.json`中新增字段`"type": "module"`

##### 组件环境

该项目准备使用typescript/vite/vue搭建，所以我们先引入一些依赖。

```sh
pnpm add vue typescript less -D -w
```

使用pnpm安装依赖如果需要在项目的根目录下则需要加`-w`

##### 初始化ts

在根目录的终端执行 `npx tsc --init`,然后项目就会生成tsconfig.json，然后我们对其做一个更改

`tsconfig.json`暂时先做这样一个配置,后续可能会有一定的调整

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "jsx": "preserve",
    "strict": true,
    "target": "ES2015",
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "Node",
    "lib": ["esnext", "dom"]
  }
}

```

##### 搭建基于vite的vue3项目

因为我们开发的是一个vue3的组件库所以我们肯定需要一个vue3的环境来测试我们的组件库，所以这里将自己搭建一个

一个基于vite的vue3项目。因此我们在根目录下新建play的文件夹然后初始化`pnpm init`修改name`@lt-frame/play`。

###### 安装插件

我们需要安装`vite`和`vitejs/plugin-vue`插件,`@vitejs/plugin-vue`插件是为了解析后缀为`.vue`文件的。在 play 目录下执行

```sh
pnpm add vite @vitejs/plugin-vue -D
```

###### 配置 vite.config.ts

新建`vite.config.ts`配置文件

```js
js
复制代码import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
```

###### 新建入口 html 文件

`@vitejs/plugin-vue`会默认加载 play 下的 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>play</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="main.ts" type="module"></script>
  </body>
</html>
```

因为 vite 是基于 esmodule 的,所以`script`标签中需要添加`type="module"`

###### app.vue

新建`app.vue`文件

```vue
<template>
  <div>启动测试</div>
</template>
```

###### 入口 main.ts

新建`main.ts`

```typescript
import App from "./app.vue";

const app = createApp(App);

app.mount("#app");
```

###### 配置脚本启动项目

在`package.json`配置`scripts`脚本

```json
{
  "name": "@lt-frame/play",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "vite"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.0.0",
    "vite": "^4.1.1"
  }
}
```

因为 play 项目需要测试本地的组件库,所以也需要将 play 和我们的组件库关联在一起。修改一下`pnpm-workspace.yaml`文件

```yaml
packages:
  - "packages/**"
  - "play"
```

此时 play 项目便可以安装本地 packages 下的包了

最后执行`pnpm run dev`,便可启动我们的 play 项目

到这里我们就完成一个 Vue3 项目的搭建,后续便可以在这个项目中进行本地组件的调试了

## 代码规范

朗通bs架构使用如下方案来搭建的代码规范

- `eslint`运行代码前就可以发现一些语法错误和潜在的 bug，目标是保证团队代码的一致 性和避免错误
- `prettier`是代码格式化工具，用于检测代码中的格式问题，比如单行代码长度，tab 长 度，空格，逗号表达式等等
- `husky`是一个未 git 客户端增加 hook 的工具，在一些 git 操作之前自动触发的函数
- `lint-staged`过滤出 git 代码暂存区（被 git add 的文件）的工具，将所有暂存文件 的列表传递给任务
- `commitlint`是对我们 git commit 提交的注释进行校验的工具
- `stylelint`CSS 检查器(linter)，帮助我们规避 CSS 代码中的错误并保持一致的编码风格

### eslint/prettier

```sh
#依赖的包
pnpm add eslint eslint-plugin-vue eslint-config-prettier prettier eslint-plugin-import eslint-plugin-prettier eslint-config-airbnb-base -D -w

#核心库
eslint-config-airbnb-base	airbnb的代码规范（依赖plugin-import）
eslint-config-prettier		eslint结合prettier的格式化
eslint-plugin-vue			    eslint在vue里的代码规范
eslint-plugin-import		  项目里面支持eslint
eslint-plugin-prettier		将prettier结合进去eslint的插件

#配置script脚本，项目安装eslint配置项目，根目录下的packages.json
"scripts": {
	"lint:create": "eslint --init"
}

#安装完成后，后面的启动项目还缺少一些依赖，提前按需安装好
pnpm add typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-alias @types/eslint @types/node -D -w

@typescript-eslint/parser						eslint解析器，解析typescript，检查规范typescript代码
@typescript-eslint/eslint-plugin		eslint插件，包含了各类定义好的检测typescript代码的规范
eslint-import-resolver-alias				让我们可以用import的时候使用@别名

```

##### eslintrc文件修改

因为`eslint`是 node 工具，所以文件名是`.cjs`结尾(commonjs 规范)——对应 的`.mjs`就是 ES Module 规范

```js
module.exports = {
	// 环境:
	env: {
		// 浏览器
		browser: true,
		// 最新es语法
		es2021: true,
		// node环境
		node: true,
	},
	// 扩展的eslint规范语法，可以被继承的规则
	// 字符串数组：每个配置继承它前面的配置
	// 分别是：
	// eslint-plugin-vue提供的
	// eslint-config-airbnb-base提供的
	// eslint-config-prettier提供的
	// 前缀 eslint-config-, 可省略
	extends: [
		'plugin:vue/vue3-strongly-recommended',
		'airbnb-base',
		'prettier'
	],
	// eslint 会对我们的代码进行检验
	// parser的作用是将我们写的代码转换为ESTree（AST）
	// ESLint会对ESTree进行校验
	parser: 'vue-eslint-parser',
	// 解析器的配置项
	parserOptions: {
		// es的版本号，或者年份都可以
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		// 源码类型 默认是script，es模块用module
		sourceType: 'module',
		// 额外的语言类型
		ecmaFeatures: {
			tsx: true,
			jsx: true,
		},
	},
	// 全局自定义的宏，这样在源文件中使用全局变量就不会报错或者警告
	globals: {
		defineProps: 'readonly',
		defineEmits: 'readonly',
		defineExpose: 'readonly',
		withDefault: 'readonly',
	},
	// 插件
	// 前缀 eslint-plugin-, 可省略
	// vue官方提供了一个ESLint插件 eslint-plugin-vue，它提供了parser和rules
	// parser为 vue-eslint-parser，放在上面的parsr字段，rules放在extends字段里，选择合适的规则
	plugins: [
		'vue',
		'@typescript-eslint'
	],
	settings: {
		// 设置项目内的别名
		'import/reslover': {
			alias: {
				map: [
					['@', './src'],
          ['#', './types']
				],
			},
		},
		// 允许的扩展名
		'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
	},
	// 自定义规则，覆盖上面extends继承的第三方库的规则，根据组内成员灵活定义
	rules: {
		'import/no-extraneous-dependencies': 0,
		'no-param-reassing': 0,
		'vue/multi-word-commponent-names': 0,
		'vue/attribute-hyphenation': 0,
		'vue/v-on-event-hyphenation': 0,
	},
};
```

##### 修改vite.config.js

```js
pnpm add vite-plugin-eslint -D
vite的一个插件，让项目可以方便的得到eslint支持，完成eslint配置后，可以快速的将其集成进vite之中，便于在代码不符合eslint规范的第一时间看到提示

import eslintPlugin from 'vite-plugin-eslint'

plugins: [vue(), eslintPlugin()]
```

##### 修改添加常见配置文件

prettier结合eslint，外部新建文件 `.eslintrcignore`、`.prettierrc.cjs`、`.prettierignore`

```js
.eslintrcignore文件内容：

*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
/bin
.eslintrc.js
prettier.config.js
/src/mock/*

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

.DS_Store
dist-ssr
*.local

/cypress/videos/
/cypress/screenshots/

# Editor directories and files
.vscode
!.vscode/extensions.json
.idea
*.suo
*.njsproj
*.sln
*.sw?

components.d.ts
```



```js
.prettiercjs.js文件内容：

module.exports = {
	// 一行最多多少字符
	printWidth: 80,
	// 使用2个空格缩进
	tabWidth: 2,
	// 使用tab缩进，不使用空格
	useTabs: true,
	// 行尾需要分号
	semi: true,
	// 使用单引号
	singleQuote: true,
	// 对象的key仅在必要时使用引号
	quoteProps: 'as-needed',
	// jsx不使用单引号，而使用双引号
	jsxSingleQuote: false,
	// 尾随逗号
	trailingComma: 'es5',
	// 大括号内的收尾需要空格
	bracketSpacing: true,
	// 箭头函数，只有一个参数的时候，也需要括号
	arrowParens: 'always',
	// 每个文件格式化的范围是文件的全部内容
	rangeStart: 0,
	rangeEnd: Infinity,
	// 不需要写文件开头的@prettier
	requirePragma: false,
	// 不需要自动在文件开头插入@prettier
	insertPragma: false,
	// 使用默认的折行标准
	proseWrap: 'always',
	// 根据显示样式决定html要不要折行
	htmlWhitespaceSensitivity: 'css',
	// 换行符使用lf
	endOfLine: 'lf',
};
```



```js
/dist/*
.local
.husky
.history
.output.js
/node_modules/**
src/.DS_Store

**/*.svg
**/*.sh

/public/*
components.d.ts
```

修改 package.json 文件，添加一个脚本命令 `"prettier-format": "prettier --config .prettierrc.cjs "src/**/*.{vue,js,ts}" --write"`

### Husky/lint-staged/commitlint

`husky`是一个未 git 客户端增加 hook 的工具，在一些 git 操作之前自动触发的函数

如果我们希望在检测错误的同时，自动修复`eslint`语法错误，就可以通过后面钩子实现

`lint-staged`过滤出 git 代码暂存区（被 git add 的文件）的工具，将所有暂存文件 的列表传递给任务

`commitlint`是对我们 git commit 提交的注释进行校验的工具

```js
pnpm add husky -D -w
配置package.json文件
(新项目需要先 git init 一下)
"prepare": "husky install"

执行 pnpm run prepare, 将husky安装完毕

----------

后面就可以添加各种 git hooks 钩子
pre-commit 一般添加的是lint-staged，去对git暂存区的代码做一些格式化的操作
npx husky add .husky/pre-commit "npx lint-staged"

add: 追加
set: 直接覆盖

----------

lint-staged对add之后，暂存区里面的文件进行格式化修复等工作
pnpm add lint-staged -D -w

package.json文件中，添加

"lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": [
      "npm run lint",
      "npm run prettier-format"
    ]
  }

----------

pnpm add @commitlint/config-conventional @commitlint/cli -D -w
安装这两个库，然后新建一个config文件(commitlint.config.cjs)

添加到git钩子里
npx husky add .husky/commit-msg "npx --no -- commitlint --edit ${1}"
通过一个命令添加钩子

使用git commit -m "提交说明"，进行提交，提交说明应尽量清晰明了，说明本次提交的目的
推荐使用Angular规范，这是目前使用最广的写法
```

```js
commitlint-config.cjs文件内容：

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				// 编译相关的修改，例如发布版本，对项目构建或者依赖的改动
				'build',
				// 新功能(feature)
				'feat',
				// 修复bug
				'fix',
				// 更新某功能
				'update',
				// 重构
				'refactor',
				// 文档
				'docs',
				// 构建过程或者辅助工具的变动,如增加依赖库等
				'chore',
				// 不影响代码运行的变动
				'style',
				// 撤销commit,回滚到上一个版本
				'revert',
				// 性能优化
				'perf',
				// 测试(单元,集成测试)
				'test',
			],
		],
		'type-case': [0],
		'type-empty': [0],
		'scope-empty': [0],
		'scope-case': [0],
		'subject-full-stop': [0, 'never'],
		'subject-case': [0, 'never'],
		'header-max-length': [0, 'always', 74],
	},
};
```

### stylelint

```js
stylelint CSS代码检查器(linter)

1. 安装vscode插件，Stylelint
2. 修改settings.json，添加下面代码
{
	"editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
	"stylelint.validate": [
		"css",
		"less",
		"scss",
		"vue"
	],
}
3. 安装项目需要的校验库，（常见的规则包）
pnpm add stylelint stylelint-config-standard -D -w

4. 根目录下建立 .stylelintrc.cjs
module.exports = {
	extends: ['stylelint-config-standard'],
};

这是一个标准样式库，也可以自动添加一些样式规则在stylelintrc.cjs文件里面

5. 执行 npx stylelint "**/*.css"
发现项目里面的style.css全局样式文件，报错很多
具体到对应的文件，按ctrl+s就会执行自动格式化我们在setting.json里面添加的语句（第2步）

6. 增加vue里面的样式支持（附带less和scss的支持）
对less的支持
pnpm add stylelint-less stylelint-config-recommended-less stylelint-config-recommended-vue -D -w

Vite也同时提供了对 .scss .sass .less .styl .stylus 文件的内置支持，不需要再安装特定插件和预处理器
.stylelintrc.cjs配置
module.exports = {
	extends: ['stylelint-config-standard',"stylelint-config-recommended-less","stylelint-config-recommended-vue"],
	overrides: [
		{
			files: ['*.less', '**/*.less'],
			customSyntax: 'postcss-less',
			extends: ['stylelint-config-recommended-less'],
		},
	],
};



7. package.json文件添加
"lint:css": "stylelint **/*.{vue,css,sass,scss} --fix"

8. 给vite添加插件
pnpm add vite-plugin-stylelint -D

修改vite.config.js文件
import stylelitPlugin from 'vite-plugin-stylelint';

plugins: [... stylelitPlugin()],

9. 添加到lint-staged里面，在暂存区对文件进行格式化
"lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": [
      "npm run lint",
      "npm run prettier-format"
    ],
    "*.{vue,less,css,scss,sass}": [
      "npm run lint:css"
    ]
  }

10. 添加一个.stylelintignore文件
/dist/*
/public/*

11. .stylelintrc.cjs内部的其他配置
module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
	overrides: [
		// 若项目中存在scss文件，添加以下配置
		{
			files: ['*.scss', '**/*.scss'],
			customSyntax: 'postcss-scss',
			extends: ['stylelint-config-recommended-scss'],
		},
		// 若项目中存在less文件，添加以下配置
		{
			files: ['*.less', '**/*.less'],
			customSyntax: 'postcss-less',
			extends: ['stylelint-config-recommended-less'],
		},
	],
};
```

## 





