import tkinter as tk
from search import query
import pathlib
import os


script_dir = pathlib.Path(__file__).parent.resolve()

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
            result.destroy()

        q = self.search_field.get()
        rows = query(q).fetchall()
        if rows:
            self.results_meta.config(text = f"Found {len(rows)} results.")
        else:
            self.results_meta.config(text = "No results found")
            self.results_meta.text = "swookays"

        for i, row in enumerate(rows):
            path = os.path.join(script_dir, row[3])
            result = tk.Button(self.master, 
                text=row[2], command=lambda: self.open_file(path))
            result.grid(row=5+i, column=1, sticky=tk.W, pady=4)
            # print(result)
            self.result_btns.append(result)
        # print(rows)
    
    def open_file(self, path):
        print(f"Opening {path}...")
        os.system(f'start /max {path}')


root = tk.Tk()
myapp = App(root)
myapp.mainloop()