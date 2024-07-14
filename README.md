About
========================
Education and care are basic needs of every human being. In today's digital age, finding
information about the facilities providing such services is crucial. Knowing where these facilities
are located and how to reach them is a key decision-making factor. Therefore, having easy access
to detailed information about these facilities on the web is necessary for informed
decision-making.

**Chemnitz BildungsZentrum** is a digital platform designed to streamline the process of locating
learning and development facilities. It leverages publicly available datasets of Kindergartens,
Schools, Social Child Projects, and Social Teenager Projects. Hence, users are able to look for
these facilities using an interactive map interface and a variety of filters. The map displays search
results of the filters as markers which are color-coded based on the type of facility it represents.
Users can click on these markers to access detailed information about each facility, including
address, contact information, opening hours, wheelchair possibility etc. Users also have the
option to set their home address to visualize the facilities near their home on the map and
estimate the distances between the home and the facility.

![markers-all](https://github.com/user-attachments/assets/ba345dd3-fe12-43d0-980d-3d40c4f883f9)

![map-with-popup](https://github.com/user-attachments/assets/e54ffbd0-6b96-45ca-923a-1df6e9f88752)


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
