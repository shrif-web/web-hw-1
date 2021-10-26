* **step #1**
  * Put file “myserver” in  directory 
  ```/etc/nginx/sites-available```
* **step #2**
  * Create a link from file "my server":
  ```$ sudo ln -s /etc/nginx/sites-available myserver /etc/nginx/sites-enabled/```
* **step #3**
  * In `myserver` fill `/*Directory To Front*/` in 7th line with the path pointing to the front directory. For example `home/sajad/Desktop/Web-Project/front`.
* **step #4**
  * Write linux user in first line of nginx.conf at /etc/nginx (like example file)\
* **step #5**
  * Check for correctness:
  ```$ sudo nginx -t```
* **step #6**
  * Now start nginx if it's not started:
  ```$ sudo systemctl start nginx\```
  * Or restart if it's started:```$ sudo systemctl restart nginx```


