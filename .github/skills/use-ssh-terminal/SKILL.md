---
name: use-ssh-terminal
description: 'Detect and use an already connected SSH terminal for all CLI work. Use when the workspace has both local and SSH terminals, when commands must run on a remote Unix or Ubuntu host, or when PowerShell must not be used. Trigger phrases: use ssh terminal, ssh only, remote ubuntu terminal, existing ssh session.'
argument-hint: 'Describe the command or task to run in the existing SSH terminal'
user-invocable: true
---

# Use SSH Terminal

Use this skill when terminal commands must run only through an existing SSH terminal session connected to a remote Unix host.

## Requirements

- Detect whether an SSH terminal is already open and connected.
- If no connected SSH terminal is available, inform the user and stop.
- Use the SSH terminal exclusively for any and all CLI commands.
- Treat the remote server as Ubuntu Linux.
- Do not run equivalent commands in PowerShell when SSH use is required.

## Procedure

1. Check the current conversation context for available terminals.
2. Look for an existing terminal explicitly identified as `ssh` or otherwise clearly described as an active SSH session.
3. If no SSH terminal is present, tell the user that no connected SSH terminal was found and exit without running commands.
4. If an SSH terminal is present, use only that SSH terminal for all command-line work for the rest of the task.
5. Assume standard Ubuntu and Unix tooling and prefer Unix command syntax, paths, and utilities.
6. Do not fall back to PowerShell, Windows command syntax, or local-shell alternatives unless the user explicitly overrides this requirement.

## Command Rules

- Use Unix-style commands and paths.
- Prefer existing remote tools such as `rg`, `grep`, `sed`, `awk`, `cat`, `ls`, `find`, `git`, `npm`, `node`, `python`, `php`, and shell pipelines as appropriate.
- Keep all related commands in the SSH terminal so working directory, environment variables, and remote state stay consistent.
- If a command would require elevated privileges, ask the user before attempting it.

## Stop Conditions

Stop and inform the user instead of proceeding when:

- no SSH terminal is available
- the SSH terminal is disconnected or not clearly connected
- the task can only be completed by using a non-SSH terminal and the user has not approved that change

## Response Pattern

When this skill is used, the agent should make its terminal choice explicit in a short update:

- `Using the existing SSH terminal for all CLI work.`
- `No connected SSH terminal was found, so I did not run any commands.`
