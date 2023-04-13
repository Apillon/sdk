# Apillon CLI

[![npm version](https://badge.fury.io/js/@apillon%2Fcli.svg)](https://badge.fury.io/js/@apillon%2Fcli)

Apillon CLI is a command-line interface for using Apillon Web3 services.

## Requirements

To be able to use Apillon CLI, you must register an account at [Apillon.io](https://app.apillon.io), create a project and generate an API key with appropriate permissions.

## Installation

To install Apillon CLI run

```bash
npm install -g @apillon/cli
```

Afterwards you can use CLI with command

```bash
apillon <command> [options]
```

Alternately you don't need to install the Apillon CLI to use it. In that case run the desired command using `npx`:

```bash
npx @apillon/cli <command> [options]
```

> Note that when running without installation, you have to use `@apillon/cli` instead of `apillon` execution command.

## Commands

The Apillon CLI currently supports the following command:

### `hosting`

To be able to deploy a website with Apillon CLI, you have to create a website deployment inside your project on [Apillon Developer dashboard](https://app.apillon.io/dashboard/service/hosting). Upon creating a website deployment, you will get the website UUID number, that you will need to run CLI hosting commands.

#### `hosting deploy-website`

Deploy your website to with Apillon Web3 platform to decentralized storage (IPFS) and pin it with Crust blockchain protocol.

#### Arguments

- `path`: Path to the folder containing your website files.

#### Options

- `-h`, `--help`: Display help for the command.
- `-p`, `--preview`: Deploy to the staging environment.
- `--uuid <website uuid>`: UUID of the website to deploy.

#### Global Options

- `--api-url <api url>`: Apillon API URL (default: Production API URL, can be set via the `APILLON_API_URL` environment variable).
- `--key <api key>`: Apillon API key (can be set via the `APILLON_KEY` environment variable).
- `--secret <api secret>`: Apillon API secret (can be set via the `APILLON_SECRET` environment variable).
- `-V`, `--version`: Output the version number.

#### Example

To deploy a website located in the ./dist folder with a specific UUID, API key, and API secret, run:

```bash
apillon hosting deploy-website ./dist --uuid your-website-uuid --key your-api-key --secret your-api-secret
# or
npx @apillon/cli hosting deploy-website ./dist --uuid your-website-uuid --key your-api-key --secret your-api-secret
```

To deploy the website to the staging environment, use the --preview flag:

```bash
apillon hosting deploy-website ./dist --uuid your-website-uuid --key your-api-key --secret your-api-secret --preview
# or
npx @apillon/cli hosting deploy-website ./dist --uuid your-website-uuid --key your-api-key --secret your-api-secret --preview
```

## Environment Variables

You can use environment variables to set the API URL, API key, and API secret:

- `APILLON_API_URL`: Apillon API URL.
- `APILLON_KEY`: Apillon API key.
- `APILLON_SECRET`: Apillon API secret.

## Help

To display the help information for the CLI or a specific command, use the `-h` or `--help` option:

```sh
apillon -h
apillon hosting -h
npx @apillon/cli hosting deploy-website --help
```
