import os
import pandas as pd
from pymongo import MongoClient

def initialize_db(uri, db_name, collection_map):
    # Connect to MongoDB
    client = MongoClient(uri)
    db = client[db_name]

    # Loop through the collection map
    for collection_name, file_path in collection_map.items():
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file_path)
        
        # Convert DataFrame to list of dictionaries
        data = df.to_dict(orient='records')
        
        # Insert data into the MongoDB collection
        collection = db[collection_name]
        if data:  # Check if there's data to insert
            collection.insert_many(data)
            print(f"Inserted {len(data)} documents into collection '{collection_name}'")
        else:
            print(f"No data found in {file_path}, skipping...")

    # Close the MongoDB connection
    client.close()

if __name__ == '__main__':
    # MongoDB connection URI
    MONGODB_URI = 'mongodb://localhost:27017/'

    # Database name
    DATABASE_NAME = 'chemnitz-bildungs-zentrum'

    # Map of collection names and their corresponding file paths
    COLLECTION_MAP = {
        'kindergartens': './csv/Kindertageseinrichtungen.csv',
        'schools': './csv/Schulen.csv',
        'social_child_projects': './csv/Schulsozialarbeit.csv',
        'social_teenager_projects': './csv/Jugendberufshilfen.csv',
    }

    # Initialize the database
    initialize_db(MONGODB_URI, DATABASE_NAME, COLLECTION_MAP)
