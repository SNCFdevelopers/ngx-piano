# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

for new features.

### Changed

for changes in existing functionality.

### Deprecated

for soon-to-be removed features.

### Removed

for now removed features.

### Fixed

for any bug fixes.

### Security

in case of vulnerabilities.

## [1.2.0] - 2024-04-12

### Added

- Add support for Angular 17 (change the minimum version of Angular to >=16)

## [1.0.1] - 2024-01-10

### Fixed

- Client app did not load correctly when the PianoJS script was inserted into the body, despite an initial script being located in the head tag. Now, we insert the PianoJS script as the last child element of the head element, [as recommended by PianoJS](https://developers.atinternet-solutions.com/piano-analytics/data-collection/sdks/javascript)

## [1.0.0] - 2023-10-26

First stable version of the library.

## [1.0.0-rc.0] - 2023-09-29

### Added

- Add possibility to set common properties (key: value) for one or all events
- Add possibility to let client project define which piano script it wants to use
- Add possibility to add route meta-data to custom a page title of a route and others specifics meta-data 

### Changed

- Make `excludedRoutePatterns` optional in `NgxPianoModule.forRoot` method
- Make `site` and `collectDomain` in `NgxPianoModule.forRoot` method as mandatory
- The type `ActionType` is now `NgxPianoActionType`

### Fixed

- Fix issue with the infinite loading of piano script which caused the app to not load

## [0.0.1] - 2023-09-27

### Added

- Add possibility to initialize the NgxPianoModule with the site id and the collector url of the project
- Track navigation events and send them to the Piano collector server
- Track click events and send them to the Piano collector server
- Add possibility to send piano event throw a service
- Add possibility to disable piano tracking
- Add possibility to exclude certain routes from piano navigation tracking

## Changelog template

### Added

for new features.

### Changed

for changes in existing functionality.

### Deprecated

for soon-to-be removed features.

### Removed

for now removed features.

### Fixed

for any bug fixes.

### Security

in case of vulnerabilities.
