FROM nginx:latest
MAINTAINER Stefan Siegl <stesie@brokenpipe.de>

COPY chrome/content/ /usr/share/nginx/html
COPY extra/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY extra/clientcert/ /etc/nginx/ssl/
