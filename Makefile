default: all

.PHONY: all
all:
	npm run build

.PHONY: clean
clean:
	npm run clean

.PHONY: install
install: all
	npm link
