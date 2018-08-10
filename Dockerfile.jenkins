FROM ubuntu:18.04

RUN dpkg --add-architecture i386 && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs wine32 rpm binutils

