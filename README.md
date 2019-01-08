### Getting Started In Development

First, duplicate the included `.env.example` file and rename it to `.env`
Generate or rename the secret key and then proceed with the terminal commands.

In your terminal run the following:

```shell
#on first run:
npm install
#also on first run
#if it doesn't work run:
# sudo npm install -g foreman
npm install -g foreman
#if it doesn't work run:
# sudo npm install -g sequelize-cli
npm install -g sequelize-cli
#open the postgresql.app first
psql -f failsafe.sql
#if you're on Mac OS X, run following
psql postgres -f failsafe.sql
#every other run after:
#open the postgresql.app
npm start
```

Visit `localhost:5000` in your browser.

To get to the console (like `rails c`):

```
npm run c
```

In the boilerplate, you can query the value of the counter model's count value and log it
using the following example within the console:

```javascript
db.counter.findById(1).then(function(counter){console.log(counter.count)})
```

### Heroku Deployment

In your terminal run the following:

```shell
#on first run:
heroku create MY_APP && heroku addons:add heroku-postgresql
heroku plugins:install heroku-config
#every other run:
git push heroku master
#or a non master branch:
git push heroku branchname:master
#if you make changes to your env file
heroku config:push
```

### Sass/Scss Setup

The `application.scss` file is available in `client/stylesheets/application.scss`.
Feel free to alter this file or `@import` additional `sass/scss` files from the
`stylesheets` folder.