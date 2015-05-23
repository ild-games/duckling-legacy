MOD = node_modules
COFFEECC = $(MOD)/coffee-script/bin/coffee --bare
BIN = build
NW_RUN = $(MOD)/nw/bin/nw
DEP_TARGET = $(MOD)/.flag
DEP_DIR = $(BIN)/dependencies

all: directories scripts views style $(BIN)/package.json dependencies

COFFEE_FILES := $(addprefix $(BIN)/,$(patsubst %.coffee,%.js,$(shell find scripts/ -type f -name '*.coffee')))
CSS_FILES := $(addprefix $(BIN)/,$(shell find styles/ -type f -name '*.css'))
VIEW_FILES := $(addprefix $(BIN)/,$(shell find views/ -type f -name '*.html'))

directories:
	@mkdir -p $(dir $(COFFEE_FILES) $(CSS_FILES) $(VIEW_FILES)) $(DEP_DIR)

$(BIN)/%: %
	cp -f $< $@

$(BIN)/%.js: %.coffee $(DEP_TARGET)
	$(COFFEECC) -o $(addprefix $(BIN)/,$(dir $*)) -c $*.coffee

$(DEP_DIR)/jquery.js: node_modules/jquery/dist/jquery.js $(DEP_TARGET)
	cp $< $(DEP_DIR) 

$(DEP_DIR)/rivets.js: node_modules/rivets/dist/rivets.js $(DEP_TARGET)
	cp $< $(DEP_DIR) 

$(DEP_DIR)/sightglass.js: node_modules/sightglass/index.js $(DEP_TARGET)
	cp $< $(DEP_DIR)/sightglass.js 

dependencies: $(DEP_DIR)/jquery.js $(DEP_DIR)/rivets.js $(DEP_DIR)/sightglass.js

scripts: $(COFFEE_FILES) 

views: $(VIEW_FILES)

style: $(CSS_FILES)

$(DEP_TARGET): package.json 
	npm install
	echo "Flag file for make process. Used to serialize parallel make." > $(MOD)/.flag

run: all dependencies
	$(NW_RUN) $(BIN)

clean:
	rm -rf $(BIN)
