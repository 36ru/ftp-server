##Подготовка окружения
1) Укажите путь к **_root_** каталогу в _**volumes**_ конфига docker-compose.yml 
<br/>
2) Укажите путь хранения пользователей в _**volumes**_ конфига docker-compose.yml 
<br/>
3) Укажите путь хранению логов в _**volumes**_ конфига docker-compose.yml 

## Пользователи
Создать файл **_users.dat_** в каталоге, где будут храниться пользователи
Заполнить данные в виде:
каждая строка **_username:password_**

## Запуск ftp сервера
`docker-compose up -d`

##Тип аутентификации
_**docker-compose.yml**_ 
<br/>
_**METHOD_AUTH**_: "normal(нормальный) | anonymous(анонимный вход)"


