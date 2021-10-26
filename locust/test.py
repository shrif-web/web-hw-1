from random import paretovariate
from locust import task, between, HttpUser
from locust.user import wait_time

class WebsiteUser(HttpUser):
    def __init__(self, parent):
        super(WebsiteUser, self).__init__(parent)
        self.urlNode = '/node/sha256'
        self.urlGo = '/go/sha256'

    wait_time = between(1, 5)

    @task
    def get_nodejs(self):
        self.client.get(self.urlNode)

    @task
    def get_golang(self):
        self.client.get(self.urlGo)

    # @task
    # def set_nodejs(self):
    #     url = 'node/sha256'
    #     pass
