from random import paretovariate
from locust import task, between, HttpUser
from locust.user import wait_time
import random
import time
import string

def id_generator(size=10, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

class WebsiteUser(HttpUser):
    def __init__(self, parent):
        super(WebsiteUser, self).__init__(parent)
        self.urlNode = '/node/sha256'
        self.urlGolang = '/go/sha256'

    wait_time = wait_time.constant(1)

    @task
    def get_golang(self):
        key = id_generator()
        self.client.get(self.urlGolang + f"?hashedString={key}",name="golang get")

    @task
    def get_nodejs(self):
        key = id_generator()
        self.client.get(self.urlNode + f"?hashedString={key}",name="node get")

    @task
    def post_golang(self):
        sha = id_generator()
        self.client.post(self.urlGolang, json={"str":sha},name="golang post")

    @task
    def post_node(self):
        sha = id_generator()
        self.client.post(self.urlNode, json={"str":sha},name="node post")
