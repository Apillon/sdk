# Apillon SDK for NodeJS

[![npm version](https://badge.fury.io/js/@apillon%2Fsdk.svg)](https://badge.fury.io/js/@apillon%2Fsdk)
![Twitter Follow](https://img.shields.io/twitter/follow/Apillon?style=social)

Apillon SDK is a NodeJS library written in Typescript for using Apillon Web3 services.

## Requirements

To be able to use Apillon CLI, you must register an account at [Apillon.io](https://app.apillon.io), create a project and generate an API key with appropriate permissions.

## Installation

To install the SDK, run the following command:

```sh
npm install @apillon/sdk
```

## Usage

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
