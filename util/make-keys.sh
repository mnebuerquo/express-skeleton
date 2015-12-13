#!/bin/sh

# create key pair for signing tokens
# needs to be in pem format
# got these commands from the makefile for node-jws
# https://github.com/brianloveswords/node-jws/blob/master/Makefile

KEYDIR="../keys"

mkdir -p $KEYDIR
openssl genrsa 2048 > $KEYDIR/rsa-private.pem
openssl rsa -in $KEYDIR/rsa-private.pem -pubout > $KEYDIR/rsa-public.pem

