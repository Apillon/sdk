# Apillon Web3 Development tools

Welcome to the Apillon Web3 Development Platform! This repository contains the source code for both the CLI and SDK libraries for the platform.

## Overview

The Apillon Web3 Development tools is an open-source toolset that makes it easy to build and deploy decentralized applications on the blockchain. It includes a command-line interface (CLI) for managing your projects, as well as a software development kit (SDK) for integrating with the Apillon APIs.

## Installation

To get started with the Apillon Web3 Development Platform, you can install either the CLI or SDK libraries. Here's how:

### CLI

To install the CLI, run the following command:

```sh
npm install -g @apillon/cli
```

### SDK

To install the SDK, run the following command:

```sh
npm install @apillon/sdk
```

## Usage

### CLI

To use the CLI, simply run the `apillon` command followed by the action you want to perform. For example, to create a new project, run:

```sh
apillon create my-project
```

For a full list of available commands and options, run:

```sh
apillon --help
# or
apillon -h
```

For a full list of subcommands and options, run:

```sh
apillon [command] --help
# or
apillon [command] -h
```

### SDK

To use the SDK in your project, first import appropriate module:

```typescript
import { Hosting } from '@apillon/sdk';
```

Then, create a new instance of the module class:

```typescript
const hosting = new Hosting({
    key: 'yourApiKey',
    secret:'yourApiSecret'
  });
```

You can then use the methods on the module instance to interact with the Apillon APIs.

For more information on using the SDK, see the [Apillon documentation](https://wiki.apillon.io//docs).

## Contributing

We welcome contributions to the Apillon Web3 Development Platform! If you would like to contribute, please follow these steps:

1. Fork this repository.
2. Clone your forked repository to your local machine.
3. Install the dependencies by running npm install.
4. Make your changes and write tests to ensure they work.
5. Commit your changes and push them to your forked repository.
6. Open a pull request to this repository.

Before submitting a pull request, please make sure to run the tests by running npm test. We also recommend running npm run lint to ensure your code follows our coding standards.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
