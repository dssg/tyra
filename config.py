import logging
import os
import yaml
from sqlalchemy.engine.url import URL

profile_file = os.environ.get('PROFILE', 'default_profile.yaml')

dbname = os.environ.get('db_name')
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

db_dict = {dbname: {"url": URL('postgres', **dbconfig), "schema": dbschema}}

try:
    if None in dbconfig.values() and None in dbschema.values():
        db_dict = {}
        if os.path.exists(profile_file):
            with open(profile_file) as f:
                config = yaml.load(f)
                try:
                    for key in config.keys():
                        dbconfig = config[key]['config']
                        if None in dbschema.values():
                            db_dict[key] = {"url": URL('postgres', **dbconfig), "schema": config[key]["schema"]}
                        else:
                            db_dict[key] = {"url": URL('postgres', **dbconfig), "schema": dbschema}
                except:
                    logging.warning('not specified db configuration correctly in default_profile.yaml')
                    raise
        else:
            logging.warning('no default_profile.yaml or enviroment variables')

except:
    db_dict = {dbname: {"url": URL('postgres', **dbconfig), "schema": dbschema}}
