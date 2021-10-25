import time
from locust import task, between, HttpUser
from locust.user import wait_time

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    self.url = '/Loader.aspx?ParTree=15'

    @task
    def get_nodejs(self):
        self.client.get()
        pass

    @task
    def set_nodejs(self):
        url = 'node/sha256'
        pass

