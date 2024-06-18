E-Commerce Project

How to initialize the database?

1. You should have already installed Postgres, DBeaver and dependencies.\
Open DBeaver to create ecomDB and connect it to the server, check clip 6 (4:15-5:40)
2. Run ```nodemon``` in the terminal. Then go to http://localhost:3000/createTables.
3. Open another terminal and run ```sequelize db:seed:all```.\
Refresh the database in DBeaver and now you have our intialized database.
