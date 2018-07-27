# Dash assignment grading code

This repository has the code that will be used to grade your Dash
HTML/CSS assignment. Once you've completed your code on General
Assembly's Dash, you'll get a URL for your completed project.
You'll submit that completed URL to me via the class website
and I will run this code to grade your assignment. You can run
this code on your own to verify that you did everything that I
expect you to do.

## Running the grading code (for students)

You will need to install [Docker](https://www.docker.com/) first. You'll likely
want the "Community Edition". Once you have that, you can pull down one of the
latest Docker [images of the grading code from Docker Hub](https://hub.docker.com/r/mgt656fall2018/dash-assignment/).

```
docker pull mgt656fall2018/dash-assignment
```

```
docker run mgt656fall2018/dash-assignment project-1 'https://dash.generalassemb.ly/YOUR-DASH-USERNAME/build-your-own-personal-website'
docker run mgt656fall2018/dash-assignment project-2 'https://dash.generalassemb.ly/YOUR-DASH-USERNAME/build-your-own-blog-theme'
```

The URLs shown in the commands above are given to you when you complete "Project 1" and
"Project 2" on dash. This grading code ensures that you completed those to our satisfaction.

By default, when you run `docker pull`, it will get the latest version of the code. You
can also pull down specific tags/releases, e.g. "v1.2", or "v2.1". We use semantic
versioning for all grading code---a major release indicates changes that will affect
student grades. Minor verion changes indicate bugfixes, clarifications, or optimizations.

## Running the grading code (for TAs and people who want to change the code)

You can also build your own custom image from this source code repo. To do that,
check out this repo `cd` into it.

Build the Docker image for this code:

```
docker build -t "mgt656:dash-assignment" .
```

Then, run the grading code

```
docker run mgt656:dash-assignment project-1 'https://dash.generalassemb.ly/YOUR-DASH-USERNAME/build-your-own-personal-website'
docker run mgt656:dash-assignment project-2 'https://dash.generalassemb.ly/YOUR-DASH-USERNAME/build-your-own-blog-theme'
```

The "mgt656:dash-assignment" tag is arbitrary. You can call it "foobar" if you want---it
does not matter.
