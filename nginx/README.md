Put file “myserver” in  directory 
```/etc/nginx/sites-available```

Create a link from file "my server"

```$ sudo ln -s /etc/nginx/sites-available myserver /etc/nginx/sites-enabled/```

Check for correctness

```$ sudo nginx -t```


Write linux user in first line of nginx.conf at /etc/nginx (like example file)\
Now start nginx if it's not started\
```$ sudo systemctl start nginx\```
Or restart if it's started\
```$ sudo systemctl restart nginx```

In `myserver` fill `/*Directory To Front*/` in 7th line with the path pointing to the front directory. For example `home/sajad/Desktop/Web-Project/front`.

