from app import app
import unittest


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()
        self.app.testing = True

    def tearDown(self):
        app.db.session.rollback()
        app.db.session.close()
