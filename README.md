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


## Package binaries

Build next app.

```bash
yarn build
```

Then package into binaries:

```bash
yarn binaries
```

Output binaries are located in `./out` folder. 

Default port is `3000`. You can change the port by running:

```bash
PORT=9876 ./dash-linux
Dashboard ready on port: 9876

```


