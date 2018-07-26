# Dash assignment grading code

This repository has the code that will be used to grade your Dash
HTML/CSS assignment. Once you've completed your code on General
Assembly's Dash, you'll get a URL for your completed project.
You'll submit that completed URL to me via the class website
and I will run this code to grade your assignment. You can run
this code on your own to verify that you did everything that I
expect you to do.

## Running the grading code

You will need to install Docker first. Then, check out this
repo and `cd` into it.

First, build the Docker image for this code:

```
docker build -t "mgt656-fall-2018:dash-assignment" .
```

Then, run the grading code

```
docker run mgt656-fall-2018:dash-assignment
```