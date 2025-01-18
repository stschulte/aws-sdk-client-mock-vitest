# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New exports `allCustomMatcher` and `allCustomMatcherWithAliases` allows to extend
  with all matchers instead of importing and extending all individual matchers

## [6.0.0] - 2025-01-17

### Added

- matcher `toHaveReceivedCommandExactlyOnceWith` can be used to verify there are
  no additional calls

### Changed

- Update dependencies. This bumps `@vitest/expect` dependency to `^3.0.1`

## [5.1.0] - 2025-01-11

### Changed

- `@smithy/types` is now a peer dependency. This should allow usage
  with a broader range of `aws-sdk-client-mock` versions without feer to install
  conflicting versions.

## [5.0.0] - 2024-12-15

### Added

- Add new matcher `toHaveReceivedAnyCommand`

### Changed

- `aws-sdk-client-mock` is now a peer dependency. This should allow usage
  with a broader range of `aws-sdk-client-mock` versions without feer to install
  conflicting versions

## [4.0.1] - 2024-10-16

### Changed

- Build package under Node 22 environment
- Bump `@vitest/expect` dependency from `^2.0.1` to `^2.1.3`

## [4.0.0] - 2024-07-09

### Changed

- Update `@vitest/expect` dependency to `2.0.1` (new major version)

## [3.0.0] - 2024-06-13

### Changed

- Switch to ESM module only (you cannot require anymore)

## [2.1.3] - 2024-05-09

## Fixes

- Fix creation of type declarations

## [2.1.2] - 2024-05-09

## Fixes

- Fix type parameter in `package.json`

## [2.1.1] - 2024-05-09

### Fixes

- Added `dist-types` to the npm package again

## [2.1.0] - 2024-05-09

### Changed

- Update `@vitest/expect` dependency to `^1.6.0`

### Removed

- Remove `prettier` in favour of a pure `eslint` configuration

## [2.0.0] - 2024-03-13

### Changed

- Update `@vitest/expect` dependency to `^1.3.1`

## [1.0.0] - 2023-09-11

### Added

- Initial release
- Full test coverage
