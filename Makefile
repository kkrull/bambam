#. ==Bam Bam==

.PHONY: default
default: all

## Sources

# NB: the wildcard function is not recursive: https://stackoverflow.com/a/2483203/112682
sources := $(shell find src -type f -iname '*.ts' | sort)

.PHONY: debug-sources
debug-sources:
	$(info Sources:)
	$(info - sources: $(sources))
	@:

## Artifacts

objects := $(patsubst src/%.ts,dist/%.js,$(sources))

.PHONY: debug-artifacts
debug-artifacts:
	$(info Artifacts:)
	$(info - objects: $(objects))
	@:

## Paths

.PHONY: debug-paths
debug-paths:
	$(info Paths:)
	$(info - node prefix: $(shell $(NPM) config get prefix))
	$(info - path: $(PATH))
	@:

## Programs

NODE := node
NPM := npm

.PHONY: debug-programs
debug-programs:
	$(info Programs:)
	$(info - NODE: $(NODE) $(shell $(NODE) --version))
	$(info - NPM: $(NPM) $(shell $(NPM) --version))
	@:

## Project

.PHONY: debug-project
debug-project:
	$(info Project:)
	@:

#. STANDARD TARGETS

.PHONY: all
all: $(objects) #> Build all artifacts
	@:

.PHONY: clean
clean: #> Remove local build files
	$(NPM) run clean

.PHONY: install
install: #> Add links to the current Node.js path, for each of this package's scripts
	$(NPM) link

.PHONY: test
test: #> Run tests
	$(NPM) run test

.PHONY: uninstall
uninstall:
	@:

#. SUPPORT TARGETS

.PHONY: debug
.NOTPARALLEL: debug
debug: | debug-artifacts debug-paths debug-programs debug-project debug-sources #> Show debugging information
	@:

# https://stackoverflow.com/a/47107132/112682
.PHONY: help
help: #> Show this help
	@sed -n \
		-e '/@sed/!s/#[.] */_margin_\n/p' \
		-e '/@sed/!s/:.*#> /:/p' \
		$(MAKEFILE_LIST) \
	| column -ts : | sed -e 's/_margin_//'

install-assets:
	@:

install-tools:
	@:

#. TYPESCRIPT TARGETS

dist/%.js: src/%.ts #> Compile TypeScript to JavaScript
	$(NPM) run build
