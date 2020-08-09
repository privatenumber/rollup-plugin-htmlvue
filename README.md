# rollup-plugin-htmlvue

Import HTML-snippets and SVGs as Vue components.

## Why?
- **Vue compiler independent** You won't be bound to any 
- **Versatile** Supports any XML-parseable markup

## Install
```sh
npm i -D rollup-plugin-vue rollup-plugin-htmlvue
```

## Config

rollup.config.js
```
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

```
htmlvue({
    include: '**/*.svg',
})
```

### Options
- **vPre** Adds [`v-pre`](https://vuejs.org/v2/api/#v-pre) to the root element.

- **vOnce** Adds [`v-once`](https://vuejs.org/v2/api/#v-once) to the root element.

- **include**
- **exclude**

