import sqlite3
import json
import os
import pathlib


script_dir = pathlib.Path(__file__).parent.resolve()
# Connection to a SQLite database
connection = sqlite3.connect(os.path.join(script_dir, "main.db"))
cursor = connection.cursor()

def create_table():
    sqliteCreateTable = "CREATE VIRTUAL TABLE files USING FTS5(keyword, filename, path);"
    # sqliteCreateTable   = "CREATE TABLE files(keyword varchar(255), filename varchar(255), path varchar(255))"
    cursor.execute(sqliteCreateTable)


def insert_files(file):
    files = json.load(file)
    for file in files["files"]:
        print(file)
        cursor.execute(f"INSERT INTO files VALUES ('{file['keyword']}','{file['filename']}','{file['path']}')")
    connection.commit()


def select_all():
    rows = cursor.execute("SELECT rowid, * FROM files")
    for row in rows:
        print(row)

def query(q):
    rows = cursor.execute(f"SELECT rowid, * FROM files where files MATCH '{q}'")
    return rows


def main():
    print("Press q to exit.")
    while True:
        try:
            q = input("Search: ")
            if q == "q":
                break
            rows = query(q).fetchall()
            if not rows:
                print("No results")
                continue
            for i, row in enumerate(rows):
                print(f"\t{i}: {row[2]}")
            selection = input("Enter choice: ")
            if selection == "q":
                break
            elif int(selection) >= 0 and int(selection) < len(rows):
                file = rows[int(selection)]
                print(f"Opening {file[3]}...")
                path = os.path.join(script_dir, file[3])
                os.system(f'start /max {path}')
            else:
                print("Try again.")
        except:
                print("Try again.")       
    connection.close()


if __name__ == "__main__":
    # create_table()
    # insert_files(open("files.json"))
    # select_all()
    # query("image")
    main()
