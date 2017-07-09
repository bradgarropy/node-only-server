# Web Server & REST API Using Only Node

*Learning about the world of JavaScript can be incredibly daunting.  
Learning [NodeJS](https://nodejs.org/) is even worse.*

So I decided to write a basic web server and REST API using only [Node](https://nodejs.org/). No express, no pug, no MongoDB, nothing.

My aim was to understand what [Node](https://nodejs.org/) had to offer on its own, and do my best to create a standard web API using just that. I figured somewhere along the way I'd understand why all of these extra modules are so nice to have.

And indeed I did.

## Features

This simple web application tracks weight measurements. It implements the following HTTP methods:

* GET
* POST
* PATCH
* DELETE

It also offers one page, the index, which shows the current weight entries.

## Usage

First, clone down the repository. Next, run the following command from inside the directory:

`npm start` or `node server`

In order to access the index page, navigate to `localhost:3000` in your browser.

## REST API

Use your favorite REST client, mine is [Postman](https://www.getpostman.com/), to send requests to the server.

### Retrieve Weight Entries
```
GET /api/weight
```

### Add Weight Entry
```
POST /api/weight  
Parameters: { "date": "2017-05-17", "weight": 180 }
```

### Update Weight Entry
```
PATCH /api/weight/:date  
Parameters: { "weight": 180 }
```

### Remove Weight Entry
```
DELETE /api/weight/:date
```

## Lessons Learned

Route parsing is a bitch using only the basic modules.

Next iteration of this project will include [Express](https://expressjs.com/) for it's excellent route parsing and middleware options.
