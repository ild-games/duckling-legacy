MOD = node_modules
COFFEECC = $(MOD)/coffee-script/bin/coffee
BIN = build
NW_RUN = $(MOD)/nw/bin/nw
DEP_TARGET = $(MOD)/.flag

all: directories scripts views style $(BIN)/package.json

COFFEE_FILES := $(addprefix $(BIN)/,$(patsubst %.coffee,%.js,$(wildcard scripts/*.coffee)))
CSS_FILES := $(addprefix $(BIN)/,$(wildcard styles/*.css))
VIEW_FILES := $(addprefix $(BIN)/,$(wildcard views/*.html))

directories:
	@mkdir -p $(BIN)/scripts $(BIN)/views $(BIN)/styles $(BIN)

$(BIN)/%: %
	cp -f $< $@

$(BIN)/%.js: %.coffee $(DEP_TARGET)
	$(COFFEECC) -o $(BIN)/scripts -c $*.coffee

scripts: $(COFFEE_FILES) 

views: $(VIEW_FILES)

style: $(CSS_FILES)

$(DEP_TARGET): package.json 
	npm install
	echo "Flag file for make process. Used to serialize parallel make." > $(MOD)/.flag

run: all $(DEP_TARGET)
	$(NW_RUN) $(BIN)

clean:
	rm -rf $(BIN)
