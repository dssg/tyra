import logging
import os
import yaml
from sqlalchemy.engine.url import URL

profile_file = os.environ.get('PROFILE', 'default_profile.yaml')

dbconfig = {
    'host': os.environ.get('PGHOST'),
    'username': os.environ.get('PGUSER'),
    'database': os.environ.get('PGDATABASE'),
    'password': os.environ.get('PGPASSWORD'),
    'port': os.environ.get('PGPORT'),
}

dbschema = {
        'feature_schema': os.environ.get('feature_schema'),
        'entity_id': os.environ.get('entity_id'),
    }


if None in dbconfig.values():
    if os.path.exists(profile_file):
        with open(profile_file) as f:
            config = yaml.load(f)
            try:
                dbconfig = {
                    'host': config['PGHOST'],
                    'username': config['PGUSER'],
                    'database': config['PGDATABASE'],
                    'password': config['PGPASSWORD'],
                    'port': config['PGPORT'],
                }
            except:
                logging.error('not specified db configuration correctly in default_profile.yaml')
                raise

    else:
        logging.error('no default_profile.yaml or enviroment variables')
        raise Exception('no default_profile.yaml or enviroment variables!')


if None in dbschema.values():
    if os.path.exists(profile_file):
       with open(profile_file) as f:
            config = yaml.load(f)
            try:
                dbschema = {
                    'feature_schema': config['feature_schema'],
                    'entity_id': config['entity_id'],
                    }
            except:
                logging.error('not specified schema configuration correctly in default_profile.yaml')
                raise
    else:
        logging.error('no default_profile.yaml or enviroment variables')
        raise Exception('no default_profile.yaml or enviroment variables!')

dburl = URL('postgres', **dbconfig)



