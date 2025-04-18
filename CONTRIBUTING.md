# Contributing to Bookshelf

Thank you for considering contributing to Bookshelf! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.

When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as much detail as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When you are creating an enhancement suggestion, please include as many details as possible:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Bookshelf which the suggestion is related to.
- **Explain why this enhancement would be useful** to most Bookshelf users.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the JavaScript and CSS styleguides
- Include adequate tests
- Document new code based on the Documentation Styleguide
- End all files with a newline

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - 🐎 `:racehorse:` when improving performance
  - 🚱 `:non-potable_water:` when plugging memory leaks
  - 📝 `:memo:` when writing docs
  - 🐛 `:bug:` when fixing a bug
  - 🔥 `:fire:` when removing code or files
  - 💚 `:green_heart:` when fixing the CI build
  - ✅ `:white_check_mark:` when adding tests
  - 🔒 `:lock:` when dealing with security
  - ⬆️ `:arrow_up:` when upgrading dependencies
  - ⬇️ `:arrow_down:` when downgrading dependencies
  - 👕 `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript code is linted with ESLint and formatted with Prettier.

### CSS Styleguide

All CSS code is linted with Stylelint and formatted with Prettier.

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown).
- Reference methods and classes in markdown with the custom `{.class}` or `{#method}` syntax.

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

#### Type of Issue and Issue State

- `enhancement`: Feature requests.
- `bug`: Confirmed bugs or reports that are very likely to be bugs.
- `question`: Questions more than bug reports or feature requests (e.g. how do I do X).
- `feedback`: General feedback more than bug reports or feature requests.
- `help-wanted`: The Bookshelf team would appreciate help from the community in resolving these issues.
- `beginner`: Less complex issues which would be good first issues to work on for users who want to contribute to Bookshelf.
- `more-information-needed`: More information needs to be collected about these problems or feature requests (e.g. steps to reproduce).
- `needs-reproduction`: Likely bugs, but haven't been reliably reproduced.
- `blocked`: Issues blocked on other issues.
- `duplicate`: Issues which are duplicates of other issues, i.e. they have been reported before.
- `wontfix`: The Bookshelf team has decided not to fix these issues for now, either because they're working as intended or for some other reason.
- `invalid`: Issues which aren't valid (e.g. user errors).

#### Topic Categories

- `documentation`: Related to any type of documentation.
- `performance`: Related to performance.
- `security`: Related to security.
- `ui`: Related to visual design.
- `accessibility`: Related to accessibility.
- `api`: Related to the API.
- `tests`: Related to tests.

#### Pull Request Labels

- `work-in-progress`: Pull requests which are still being worked on, more changes will follow.
- `needs-review`: Pull requests which need code review, and approval from maintainers or Bookshelf team.
- `under-review`: Pull requests being reviewed by maintainers or Bookshelf team.
- `requires-changes`: Pull requests which need to be updated based on review comments and then reviewed again.
- `needs-testing`: Pull requests which need manual testing.
