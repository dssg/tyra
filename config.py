import os
import yaml
from sqlalchemy.engine.url import URL

profile_file = os.environ.get('PROFILE', 'default_profile.yaml')

with open(profile_file) as f:
    config = yaml.load(f)

    dbconfig = {
        'host': config['PGHOST'],
        'username': config['PGUSER'],
        'database': config['PGDATABASE'],
        'password': config['PGPASSWORD'],
        'port': config['PGPORT'],
    }
    dburl = URL('postgres', **dbconfig)
