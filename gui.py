import tkinter as tk
from search import query
import pathlib
import os


script_dir = pathlib.Path(__file__).parent.resolve()

class Button(tk.Button):
    def __init__(self, path, filename, master, i):
        super().__init__(master)
        self.path = path
        self.button = tk.Button(master, 
                text=filename, command=self.open_file)
        self.button.grid(row=5+i, column=1)

    def open_file(self):
        print(f"Opening {self.path}...")
        os.system(f'start /max {self.path}')

class App(tk.Frame):
    def __init__(self, master):
        super().__init__(master)
        # self.pack()
        self.master = master
        tk.Label(master, 
         text="Search: ").grid(row=0)

        self.results_meta = tk.Label(master, text="")
        self.results_meta.grid(row=1, column=1)

        self.search_field = tk.Entry(master)
        self.search_field.grid(row=0, column=1)

        self.result_btns = []
        tk.Button(master, 
                text='Go', command=self.get_results).grid(row=0, 
                                                            column=3, 
                                                            sticky=tk.W, 
                                                            pady=4)


    def get_results(self):
        for result in self.result_btns:
            result.button.destroy()
        self.result_btns.clear()
        print(self.result_btns)

        q = self.search_field.get()
        rows = query(q).fetchall()
        if rows:
            self.results_meta.config(text = f"Found {len(rows)} results.")
        else:
            self.results_meta.config(text = "No results found")

        for i, row in enumerate(rows):
            path = os.path.join(script_dir, row[3])
            self.result_btns.append(Button(path, row[2], self.master, i))
        # print(rows)
    
    def open_file(self, path):
        print(f"Opening {path}...")
        os.system(f'start /max {path}')


root = tk.Tk()
myapp = App(root)
myapp.mainloop()