MOD = node_modules
COFFEECC = $(MOD)/coffee-script/bin/coffee
BIN = build/

all: directories scripts views style

COFFEE_FILES := $($(wildcard scripts/*.coffee):%.js:%.coffee)
CSS_FILES := $(wildcard style/*.css)
VIEW_FILES := $(wildcard views/*.html)

directories:
	mkdir -p $(BIN)/scripts $(BIN)/views $(BIN)/styles $(BIN)

%.js: $*.coffee
	$(COFFEECC) -c $*.coffee $(BIN)/scripts

scripts: $(COFFEE_FILES)

%.html: $*.html
	mv $* $(BIN)/views

views: $(VIEW_FILES)

%.css: $*.css
	mv $* $(BIN)/styles

style: $(CSS_FILES)

run:
