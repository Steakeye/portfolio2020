Add this stage back into the `lint-staged` config in `package.json` when svelte-check issues can be resolved

```
    "src/**/*.(svelte)": [
      "npm run svelte:check"
    ],
```
