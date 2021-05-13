#Resources Management System.
## Система планирования и учёта трудозатрат инженеров внедрения. 

### Цель создания системы.
Замена устаревшей КИС в части постановки, планирования и учёта задач инженеров.

### Краткое описание функционала.
#### Роли.
* менеджер (manager) – создаёт заявки на проведение работ (@TODO! правит свои заявки);
* руководитель группы инженеров (teamlead) - принимает/отклоняет/распределяет заявки, создаёт пользователей;
* инженер (engineer) - выполняет работы, пишет отчёт по итогам работ.

#### Процесс работы с системой (подразумевается запуск в dev-режиме на http://127.0.0.1:3000/).
0. Авторизация (/login/)
1. Менеджер создаёт заявку с указанием направления, заказчика, etc (/task/create/). Статус заявки – Open.
2. Руководитель группы принимает заявку (выставляет статус Accepted), либо отклоняет (Rejected). С правами руководителя группы действия из пунктов 2.-4. доступны на стартовой странице.
3. По итогам анализа заявок, руководитель группы выбирает варианты исполнения:
   1. назначает заявки инженерам или 
   2. помечает на исполнение силами подрядной организации (заявка уходит в работу ответственному сотруднику).
3. @TODO! Оставшиеся нераспределенные заявки (нехватка ресурсов, перенос по инициативе заказчика, etc) инициаторы самостоятельно переносят на новую дату. Отменённые задачи инициаторы переводят в статус Rejected.
4. По итогам выполнения работ, инженер заполняет форму еженедельного отчёта, путём выбора нужных задач в ЛК (/employee/assigned-tasks/). При сохранении отчёта все связанные заявки получают статус Done. Наполнение отчёта:
    1. краткий текст с пояснениями в свободной форме о ходе работ в целом; 
    2. итоги работ на неделе; 
    3. ссылку на архив с конфигурационными файлами (@TODO! отдельно для каждой заявки);
    4. затраченное фактическое время (для каждой заявки, в т.ч. комментарии о необходимости ночных работ).
5. Сводный график работ на неделю формируется автоматически, актуальная версия доступна по ISO-номеру недели (ex.: /task/schedule/2021W17/). @TODO! Ежедневная групповая рассылка графика.  

#### Адресаты получают e-mail уведомления в зависимости от действий в системе.
1. Появление новой заявки:
   1. руководитель группы инженеров
2. Изменение статуса заявки, перенос сроков исполнения:
    1. инициатор (менеджер)
    2. руководитель группы инженеров
    3. исполнитель (если уже назначен)     
3. Назначение заявки на инженера:
   1. инициатор (менеджер)
   2. исполнитель (инженер)
4. Отчёт по итогам работ:
   1. общий список рассылки группы инженеров;
   2. инициатор (менеджер) каждой задачи, включенной в отчёт
   3. группа технической поддержки направления каждой задачи, включенной в отчёт

Технологический стек:
```
Backend: Django + DRF + PostgreSQL
Frontend: React + Redux
Очереди задач: Celery + Redis
Авторизация пользователей: JWT Authentication (по e-mail)
```