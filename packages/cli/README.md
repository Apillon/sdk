# Apillon CLI

[![npm version](https://badge.fury.io/js/@apillon%2Fcli.svg)](https://badge.fury.io/js/@apillon%2Fcli)
[![Twitter Follow](https://img.shields.io/twitter/follow/Apillon?style=social)](https://twitter.com/intent/follow?screen_name=Apillon)

Apillon CLI is a command-line interface for using Apillon Web3 services.

## Requirements

To be able to use Apillon CLI, you must register an account at [Apillon.io](https://app.apillon.io), create a project and generate an API key with appropriate permissions. Also Node.js (version 16 or later) is required.

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

- `--api-url <api url>`: Apillon API URL (default: Production API URL, can be set via the `APILLON_API_URL` environment
  variable).
- `--key <api key>`: Apillon API key (can be set via the `APILLON_API_KEY` environment variable).
- `--secret <api secret>`: Apillon API secret (can be set via the `APILLON_API_SECRET` environment variable).
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
- `APILLON_API_KEY`: Apillon API key.
- `APILLON_API_SECRET`: Apillon API secret.

## Help

To display the help information for the CLI or a specific command, use the `-h` or `--help` option:

```sh
apillon -h
apillon hosting -h
npx @apillon/cli hosting deploy-website --help
```

## Using in CI/CD tools

CLI is particularly useful for CI/CD builds and pipelines.

### Deploying websites

Here's an example of how you can use the CLI tool in a CI/CD tool like GitHub Actions:

```yml
name: Deploy Website

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      
      - name: Create dist folder
        run: mkdir -p dist
          
      - name: Copy files
        run: |
          cp *.html dist/
          cp -r images dist/
          cp -r style dist/
          cp -r js dist/

####
## if you are using a framework for building web app, you can replace previous two step with the 
## appropriate command for generating static webpage, like an example bellow.
## Find the correct command in your framework documentation. You may need to to change the 
## name of the source folder in the last step (CLI call)
####

      # - name: Build app
      #   run: npm run build


      - name: Deploy website
        env:
          APILLON_API_KEY: ${{ secrets.APILLON_API_KEY }}
          APILLON_API_SECRET: ${{ secrets.APILLON_API_SECRET }}
          WEBSITE_UUID: ${{ secrets.WEBSITE_UUID }}
        run: npx --yes @apillon/cli hosting deploy-website ./dist --uuid $WEBSITE_UUID --key $APILLON_API_KEY --secret $APILLON_API_SECRET
```

In this example, the GitHub Actions workflow is triggered when a push event occurs on the master branch. The workflow performs the following steps:

1. Checks out the repository.
2. Sets up Node.js with version 16.
3. Creates a dist folder to store the website files.
4. Copies the necessary files (HTML, images, styles, and JavaScript) to the dist folder.
5. Deploys the website using the CLI tool. The required environment variables (APILLON_API_KEY, APILLON_API_SECRET, and WEBSITE_UUID) are provided as secrets. The npx command ensures that the latest version of the CLI tool is used.

Make sure to setup secret variables with the values from Apillon platform.

That's it! You can now use this example as a starting point to deploy your website using the CLI tool in a CI/CD pipeline with GitHub Actions.
