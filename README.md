# Tyra

## Prediction model evaluation dashboard

## Quick Start

1. Install requirements: `pip3 install -r requirements.txt`

2. Copy example_default_profile.yaml to default_profile.yaml and modify to point to your database

3. Run `python3 run_webapp.py`

4. Enter `http://localhost:5001/` in your local browser

## Running multiple instances
Since Tyra is built to look at different project databases, being able to run multiple instances side-by-side is helpful. To accomplish this, you can pass environment variables to configure the database credential file path and the port. So these two commands will work:

`PROFILE=/path/to/first/profile.yaml PORT=5001 python3 run_webapp.py`
`PROFILE=/path/to/second/profile.yaml PORT=5002 python3 run_webapp.py`
