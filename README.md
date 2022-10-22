# Lucky Challenge

## Local execution with Docker
 The command will start the API and Redis service and will create a SQL Server instance with the corresponding database structure
`docker-compose up --build`

 It is recommended to wait 90 seconds for the service to start. The database process waits until the SQL Server is running to execute the creation of the database.
 Once everything is running we should see this container:

![Docker Services](/images/docker.png?raw=true "Docker Services")

## Application access
To be able to see all the endpoints and structures we are using Swagger. The endpoints documentation can be accessed by `http://localhost:3001/docs`

If the project was build successfully, we should see this screen from the previous link:

![endpoint docs](/images/docs.png?raw=true "endpoint docs")

## Database Access
To access the database it is required to have installed MSSQS. The password is: `password123!`
The rest is detailed here:
![db access](/images/dbaccess.png?raw=true "db access")

## Testing
To execute the E2E tests, we need to run the command:
`npm run test:e2e`

If everything ends up successfully we should be able to see the following results:

![tests](/images/tests.png?raw=true "tests")