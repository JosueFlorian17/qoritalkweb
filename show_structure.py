import os

def print_tree(start_path='.', prefix=''):
    items = sorted(os.listdir(start_path))
    for index, item in enumerate(items):
        item_path = os.path.join(start_path, item)
        is_last = index == len(items) - 1
        connector = '└── ' if is_last else '├── '
        print(prefix + connector + item)
        if os.path.isdir(item_path):
            new_prefix = prefix + ('    ' if is_last else '│   ')
            print_tree(item_path, new_prefix)

if __name__ == "__main__":
    print("📁 Contenido de la carpeta:")
    print_tree()
