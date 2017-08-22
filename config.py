import logging
import os
import yaml
from sqlalchemy.engine.url import URL

profile_file = os.environ.get('PROFILE', 'default_profile.yaml')
schema_config = os.environ.get('SCHEMA', 'db_schema.yaml')

if os.path.exists(profile_file):
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

else:
    logging.info('No config file found, using environment variables')
    dbconfig = {
        'host': os.environ.get('PGHOST'),
        'username': os.environ.get('PGUSER'),
        'database': os.environ.get('PGDATABASE'),
        'password': os.environ.get('PGPASSWORD'),
        'port': os.environ.get('PGPORT'),
    }
    dburl = URL('postgres', **dbconfig)

if os.path.exists(schema_config):
    with open(schema_config) as f:
        config = yaml.load(f)
        dbschema = {
            'feature_schema': config['feature_schema'],
            'entity_id': config['entity_id'],
        }
else:
    logging.info('No config file found, using environment variables')
    dbschema = {
        'feature_schema': os.environ.get('feature_schema'),
        'entity_id': os.environ.get('entity_id'),
    }
