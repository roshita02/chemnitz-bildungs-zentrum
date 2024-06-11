Project Setup Manual
========================

This manual provides step-by-step instructions for setting up the base, backend and the frontend.

**1. Database Setup:**
   a. Install MongoDB: Visit the MongoDB website (<https://www.mongodb.com/>) and follow the instructions to download and install MongoDB for your OS.
   b. Start MongoDB: After installation, start the MongoDB server by running the appropriate command for your system. For example:

      mongod

   c. Initialize Project Database: Run the Python script `init_db.py` provided in the project folder to initialize the database with data from CSV files. Make sure to modify the script if necessary to specify the correct MongoDB URI. Note that you need to have python installed to run the script as follows:
      
      python init_db.py

**2. Backend Project Setup:**
   a. Navigate to Project Directory: Open a terminal/command prompt window and navigate to the `chemnitz-bildungs-zentrum-api` directory.
   b. If you don't have Node.js, you need to install them. Visit this website (<https://nodejs.org/en>) and follow the installation instructions.
   c. Install Dependencies: Install the necessary dependencies for the project. For example:

      npm install

   d. Create a .env file inside `chemnitz-bildungs-zentrum-api` if it doesnot exists. You need to define a `JWT_SECRET` value for authentication.

   e. Run Project: Start the server. For example:

      npm run dev

   e. Access Project: Test if the project is running on port 3000.
  

**3. Frontend Project Setup:**
   a. Navigate to Project Directory: Open a terminal/command prompt window and navigate to the `chemnitz-bildungs-zentrum-ui` directory.
   b.  If you don't have Angular CLI, you need to install them globally using npm.

      npm install -g @angular/cli

   c. Install Dependencies: Install the necessary dependencies for the project. For example:

      npm install

   d. Run Project: Start the project. For example:

      ng serve

   e. Access Project: Once the project is running, you can access it through a web browser. By default, the development server runs on `http://localhost:4200`.