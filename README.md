#Welcome to Duckling

##Setup Instructions

###Installing Dependencies
1. Install npm
2. Use npm to globaly install grunt `sudo npm install -g grunt-cli'

###Webstorm
1. Clone the git repository.
2. Run npm install in the directory to pull in dependencies.
3. Run grunt to build the source.
4. Create a node-webkit target.  Use the nw executable found in the node_modules.  The app directory should be set to the index.json file in the build directory.

###Hard Mode (Vim / Sublime / ... )
1. Clone the git repository.
2. Run `make` to build the application.
3. Run `make run` to run the application.
