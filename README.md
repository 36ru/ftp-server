## Подготовка окружения
1) Укажите путь к **_root_** каталогу в _**volumes**_ конфига docker-compose.yml 
2) Укажите путь хранения пользователей в _**volumes**_ конфига docker-compose.yml 
3) Укажите путь хранению логов в _**volumes**_ конфига docker-compose.yml 

`
    volumes:
      - "c:/app/storage:/storage"
      - "c:/app/logs:/logs"
      - "c:/app:/users"
`


## Пользователи
Создать файл **_users.dat_** в каталоге, где будут храниться пользователи
Заполнить данные в виде:
каждая строка **_username:password_**

## Запуск ftp сервера
`docker-compose up -d`

или

`docker build -t ftp .`

`docker run -v c:/app/storage:/storage -v c:/app/logs:/logs -v c:/app:/users -p 21:21 -p 4000-5000:4000-5000 -e METHOD_AUTH='normal' ftp`

затем


##Тип аутентификации
_**docker-compose.yml**_ 
<br/>
_**METHOD_AUTH**_: "normal(нормальный) | anonymous(анонимный вход)"


