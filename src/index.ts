#!/usr/bin/env node

import { Command } from 'commander';
import { loginCommand } from './commands/login';
import { statusCommand } from './commands/status';

const program = new Command();

program
  .name('coding-agents-quota')
  .description('Query AI coding agent quotas across multiple providers')
  .version('0.1.0');

program
  .command('login')
  .description('Login to a provider and save credentials')
  .argument('[provider]', 'Provider name (minimax, zhipu, etc.)')
  .action(loginCommand);

program
  .command('status')
  .description('Get current quota usage')
  .argument('[provider]', 'Provider name (minimax, zhipu, etc.)')
  .action(statusCommand);

program.parse();
