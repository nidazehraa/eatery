# `eatery` — APP to find the local eateries near you

This project is an application to locate the restaurants/food places near your location along with
the functionality to add and look over the reviews.

### Prerequisites

Make sure you clone the repository.
In order to run this application you need to have node/npm and bower installed in your system

### Clone `eatery`

Clone the `eatery` repository using git:

```
git clone https://github.com/angular/angular-seed.git
cd eatery
```

### Install Dependencies

Please make sure you have node and bower installed.
In case node_modules folder in not there in the directory, please run the following command to install dependencies.


```
npm install
```
This command will install all the dependencies that are mentioned in the package.json file.


### Import Database

Please make sure you have mysql configured on your system and its up and running.
Import the db dump into mysql. create a mysql database by name eatery and import the sql file 
eatery.sql from the directory.


### Run the Application

In order to run this application, we need to start the node server using the following command.

```
node server.js
```
This will start the server at http://localhost:3000


### Running the App in Production

In order to deploy an application in production and ideal way is to use PAAS that offers monitoring, high availability and auto scaling. An example of such platform is Amazon Elastic Beanstalk that in addition to above offers multiple environment and version management keeping application code and infrastructure seperate.

http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-getstarted.html

In order to deploy our application in production we need to create an new environment and choose the
platform the matches our language and add an RDS DB instance and det up permissions and identifier for the environment.


## Continuous Integration

### Travis CI

[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits to
your repository and execute scripts such as building the app or running tests.Eateru app contains a
Travis configuration file, `.travis.yml`, which will cause Travis to run your
tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the
[Travis website][travis-docs] for instructions on how to do this.
