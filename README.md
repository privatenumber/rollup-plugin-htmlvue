# rollup-plugin-htmlvue <a href="https://npm.im/rollup-plugin-htmlvue"><img src="https://badgen.net/npm/v/rollup-plugin-htmlvue"></a> <a href="https://npm.im/rollup-plugin-htmlvue"><img src="https://badgen.net/npm/dm/rollup-plugin-htmlvue"></a> <a href="https://packagephobia.now.sh/result?p=rollup-plugin-htmlvue"><img src="https://packagephobia.now.sh/badge?p=rollup-plugin-htmlvue"></a>

Import HTML-snippets and SVGs as Vue components.

### Features
- 🔥 **Not coupled to Vue compiler** Comiles the HTML to a Vue.js SFC for the [Vue plugin](https://github.com/vuejs/rollup-plugin-vue) to handle compilation
- 💫 **Versatile** Supports any XML-parseable markup

## 🙋 Why?
Great for compiling SVG files as Vue.js components.

## 🚀 Install
```sh
npm i -D rollup-plugin-vue rollup-plugin-htmlvue
```

## 🛠 Config

rollup.config.js
```js
import vue from 'rollup-plugin-vue';
import htmlvue from 'rollup-plugin-htmlvue';

export default {
    // ...

    plugins: [
        vue(),
        htmlvue(),
    ],
}
```

By default, it only automatically resolves `.html` files. To apply it to other extensions:

```js
htmlvue({
    include: '**/*.svg',
})
```

## ⚙️ Options
- `vPre` `<Boolean>` (`false`)

    Adds [`v-pre`](https://vuejs.org/v2/api/#v-pre) to the root element.
- `vOnce` `<Boolean>` (`false`)

    Adds [`v-once`](https://vuejs.org/v2/api/#v-once) to the root element.
- `include` and `exclude`

    Patterns to identify which files to apply the plugin to. Passed into [@rollup/pluginutils](https://github.com/rollup/plugins/tree/master/packages/pluginutils#include-and-exclude).
