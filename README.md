# Discord Sapphire Bot Template

## Features

- Typescript
- Sapphire Framework
- Excelent tooling and processes that make development fast and easy!
  - tscwatch to quickly reload changes as you save them
  - Prettier and ESLint configured to help you write cleaner code with less traps for you to fall into
  - Husky to stop you committing bad code
- [DRPG Logger](https://www.npmjs.com/package/drpg-logger) (custom logging to replace console.log spam). 
  - _The docs (and install method) on this are a little out of date, but the npm page will give you a good idea of it's over-all functionality._

## Getting Started
1. Clone the repo
2. run `npm install`
3. Copy `.env.example` and rename it to `.env` (this will store all your sensitive config info, and will be _ignored_ by Git)
4. Provide your Bot Token, Owner ID, and Log Channel, options in your new env file
5. run `npm run dev`
6. Work and wait for the magic to happen!

## Commands

By default, a couple of commands are provided, with several aliases for each

-   `^ping` ~hails a cab~ duh
-   `^help` views the custom IDrpgCommandOptions decorator on each object. Provide a command name or alias
-   `^buttontest` embeds and buttons, with a random number generator baked into it as an example



## Other info

-   You may see several references to 'Drpg' - Discord RPG Community. This is a sort of "brand"/community that I've created - mostly for myself, that follow this same framework and patterns, and has shared common utilities (DRPG-Logger and DRPG-Utils).
