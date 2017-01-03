# Tyra

## Prediction model evaluation dashboard

## Quick Start

1. Install requirements: `pip3 install -r requirements.txt`

2. Copy example_default_profile.yaml to default_profile.yaml and modify to point to your database

3. Run `python3 run_webapp.py`

4. Enter `http://localhost:5001/` in your local browser

## Database Schema
Tyra is designed to work on different data science projects, but to accomplish this it expects a standard model storage interface; a Postgres database with a `results` schema containing three tables, `models`, `evaluations`, and `predictions`.

### models
- model_id - integer
- run_time - timestamp
- model_type - string

### evaluations
- model_id - integer
- metric - string (each value should be one of the Available Metrics below)
- parameter - string (most data represents floats, though)
- value - numeric

### predictions
- model_id - integer
- unit_id - bigint
- unit_score - numeric
- label_value - int

### feature_importances
- model_id - integer
- feature - string
- feature_importance - numeric

Whether or not the `model_id` columns in `predictions` and `evaluations` is defined as a foreign key, it should act as one as the tables are joined using it.

No assertions are made on other tables in the `results` schema or other schemas, or on other columns in these tables.

### Available Metrics
The list of metrics that will be displayed to the user currently lives in `webapp/static/components/metric-selector.js`, but for convenience the list at the time of writing is:
- precision@
- recall@
- auc
- f1
- true positives@
- true negatives@
- false positives@
- false negatives@


## Running multiple instances
Since Tyra is built to look at different project databases, being able to run multiple instances side-by-side is helpful. To accomplish this, you can pass environment variables to configure the database credential file path and the port. So these two commands will work:

`PROFILE=/path/to/first/profile.yaml PORT=5001 python3 run_webapp.py`

`PROFILE=/path/to/second/profile.yaml PORT=5002 python3 run_webapp.py`

## Front-end setup

Tyra uses NodeJS and Webpack to organize and bundle frontend dependencies.

### Initial setup
1. Install NodeJS (https://nodejs.org/en/)

2. `cd frontend`

3. `npm install` to install dependencies (the initial install will take a few minutes, go have a snack!)

4. `npm run build` to initially create the bundled javascript file

### During development
`npm run start` will start a webpack '--watch' command that watches your javascript and compiles it to webapp/static/output.js. The initial startup will probably take 10-15 seconds, but every time you save a javascript file the recompilation will be much quicker.

New components can be added in the `frontend/components` directory. There is a directory for each component, because soon (not yet) we will start bundling styles in individual component directories. Other components will be able to import your new component right away, but if you would like the component to made available *globally* (in other words, a Flask template), you will have to add this to `frontend/index.js`

### Installing new modules
In the `frontend` directory, install the package you want with `npm install --save <pkg-name>`. The --save option will persist this change to package.json.
