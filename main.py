import os
import sys
import webview

def resource_path(relative_path):
    """Получает корректный путь к файлам внутри собранного .exe"""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

if __name__ == '__main__':
    html_file = resource_path("index.html")
    
    # Создаём окно приложения под размер игры
    window = webview.create_window(
        title='STEEL DINO RUN',
        url=html_file,
        width=900,
        height=420,
        resizable=False
    )
    webview.start()
