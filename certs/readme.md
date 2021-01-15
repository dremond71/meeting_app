# Creating SSL Certificate and Key

What follows are steps I used to create an SSL certificate and key on Windows 10.

## Prerequisites

Install [Git](https://git-scm.com/downloads).

Git is a trusted program and it comes with command line tools to create ssl certificates

## Steps

- Open a Git Bash Command window inside meeting_app/certs
- Use the command
  ```sh
   winpty openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
  ```
- This command will prompt you for several things. Here is what I entered.
   - Pass Phrase: I entered a short sentence
   - Country name: CA (for Canada)
   - State or Province: Ontario
   - Locality Name: Toronto
   - Organization Name: dremond
   - Organization Unit: meeting
   - Common Name : yourhostname.com OR yourName
   - Email Address: myemail
  
This created 2 files:
- cert.pem
- keytmp.pem

To generate key.pem, enter the command
```sh
winpty openssl rsa -in keytmp.pem -out key.pem
```

You should now have 3 files in meeting-app/certs:
- cert.pem
- keytmp.pem
- key.pem