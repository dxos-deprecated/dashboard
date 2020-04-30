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
- `npm version prerelease` (Tag version has to be done before build so version.json is generated at build time with correct version).
- `CONFIG_FILE=./config/config-prod.yml yarn next build`.
- `npm publish -tag beta`

Finally push all changes and tags `git push --follow-tags`.


