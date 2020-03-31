# Changelog
# 0.5.3
## Fixed:
* compression support

# 0.5.2
## Fixed:
* node 4 and 5 support

# 0.5.1
## Added
* HTTP/2 does not read connection headers

## Fixed:
* security update in `yarn.lock`

# 0.5.0
## Added:
* compression support with `isCompressed` option

## Fixed:
* TimeoutOverflowWarning

# 0.4.1
## Added:
* `dropInit` method
* more tests

## Fixed:
* event listener handling
* don't send an empty array on initial event for `isSerialized = false`

# 0.4.0
## Added:
* `serialize` method
* initial options
* basic test suites

## Fixed:
* event listener memory leak

# 0.3.2
## Fixed:
* node v4 compatibility

# 0.3.1
## Fixed:
* internal fixes

# 0.3.0
## Added:
* named events
* custom IDs

# 0.2.1
## Fixed:
* crashes on node v0.12

# 0.2.0
## Added:
* initial content
* initial content updating

# 0.1.0
* initial release
