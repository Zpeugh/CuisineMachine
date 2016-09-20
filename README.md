# CuisineMachine

CSE 5914 Capstone repo

To run, open a terminal in the directory and do the following:

```
$ npm install
$ node server.js
```

Open http://localhost:8080/home


#app
---
This is the main directory for the AngularJS application

#utilities
---

###add_recipe_to_cluster.js
This file takes a json file of recipes and adds them to the Retrieve and Rank cluster
```
$ node add_recipe_to_cluster.js <json file>
```
The JSON file must be in the format:

```
{
	"recipes": [
            {
        		"id": "",
        		"title": "",
        		"picture": "",
        		"ingredients": "",
        		"instructions": "",
        		"about": "",
        		"yield": "",
        		"tags": ""
	        },
            { ... },
            { ... }
    ]
}
```
