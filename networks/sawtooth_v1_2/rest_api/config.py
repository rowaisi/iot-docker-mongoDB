import yaml
import logging
LOGGER = logging.getLogger(__file__)

receivers = ["rest-api-0:8008"]

def init_config():
    with open("/configuration/blockchain.yaml", 'r') as stream:
        try:

            loaded_config = yaml.safe_load(stream)
            if (loaded_config['sawtooth'] and loaded_config['sawtooth']['receivers']):
                global receivers
                receivers = loaded_config['sawtooth']['receivers']


        except yaml.YAMLError as exc:
            LOGGER.warning(exc)
