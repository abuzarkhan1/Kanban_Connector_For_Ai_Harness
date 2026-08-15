# Release Plan

## Development builds

Provide local development builds for:
- macOS
- Windows
- Linux

## Production packaging

Use Electron packaging with:
- application signing
- platform-specific installers
- versioned migrations
- crash-safe updates

## Release channels

Recommended:
- development
- beta
- stable

## Pre-release checklist

- database migration tested
- fresh install tested
- upgrade tested
- uninstall/reinstall tested
- repository observation tested
- multi-worktree tested
- permission behavior tested
- renderer isolation verified
- no secrets in logs
- signed artifacts verified

## Update safety

Application updates must not destroy SQLite data.

Before migrations:
- validate schema version
- perform safe migration
- provide recovery path

## Platform considerations

OS-specific observer implementations must be tested independently. Capability detection should replace assumptions about permissions.
