#Welcome to Duckling

##Setup Instructions

###Installing Dependencies
1. Install npm
2. Use npm to globally install grunt `sudo npm install -g grunt-cli'
3. Install Ruby `sudo apt-get install ruby'
4. Install Sass 'sudo gem install sass'
5. Install project dependencies `npm install; grunt install`

###Webstorm
1. Clone the git repository.
2. Run npm install in the directory to pull in dependencies.
3. Run grunt to build the source.
4. Create a node-webkit target.  Use the nw executable found in the node_modules.  The app directory should be set to the index.json file in the build directory.

###Hard Mode (Vim / Sublime / ... )
1. Clone the git repository.
2. Run the duckling script.

###Running Unit Tests
1. Run grunt to build everything.
2. Run ./duckling test
