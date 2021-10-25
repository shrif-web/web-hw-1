from random import paretovariate
import time
from locust import task, between, HttpUser
from locust.user import wait_time

class WebsiteUser(HttpUser):
    def __init__(self, parent):
        super(WebsiteUser, self).__init__(parent)
        self.urlNode = '/'

    wait_time = between(1, 5)

    @task
    def get_nodejs(self):
        self.client.get(self.urlNode)

    # @task
    # def set_nodejs(self):
    #     url = 'node/sha256'
    #     pass
