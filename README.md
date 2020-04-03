# Dashboard

Dashboard server for xBox and other compute environments.

## Serve in Production Mode

First build:

```bash
yarn build
```

Then start server:

```bash
yarn start
```

## Dev Mode

Build is not needed.

`yarn run dev`

## Publish to NPM

- `rm -rf ./next` (Make sure we remove next folder).
- `yarn build`.
- `npm version prerelease`
- `npm publish -tag beta`

Finally push all changes and tags `git push --follow-tags`.


