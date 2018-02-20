# Bathyspheres

Bathyspheres allows a user to login, load up a project they’ve shared with a collaborator, and get right to making music. One user might be working on writing the music while another simultaneously edits the synth to get that perfect sound.

## Built With

PostgreSQL, JavaScript, AngularJS, AngularJS Material, Web Audio Api, Node, HTML, and CSS.

## Getting Started

npm install

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)


### Installing

Steps to get the development environment running.

```sql
CREATE TABLE "users" (
  "id" serial primary key,
  "username" varchar(80) not null UNIQUE,
  "password" varchar(240) not null
);

CREATE TABLE "projects" (
	"id" SERIAL PRIMARY KEY,
	"project_name" VARCHAR(200) NOT NULL,
	"creator" INT REFERENCES users(id)
	);
	
CREATE TABLE "projects_users_junction" (
	"id" SERIAL PRIMARY KEY,
	"project_id" INT REFERENCES projects(id),
	"user_id" INT REFERENCES users(id)
	);

CREATE TABLE "component" (
	"id" SERIAL PRIMARY KEY,
	"component_name" VARCHAR (140) NOT NULL,
	"project_id" INT REFERENCES projects(id) NOT NULL,
	"score" VARCHAR (1792) NOT NULL,
	"preset_id" INT REFERENCES presets(id) NOT NULL

);

CREATE TABLE "presets" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES users(id),
	"preset_name" VARCHAR (280)
	);
```




## Authors
Danika Ragnhild (Awl)


## Acknowledgments

A thank you to padenot without whom's litsynth this would not be possible.
