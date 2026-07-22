Стек:

Next.js
TypeScript
Tailwind
shadcn/ui
React Query
Zustand (optional)
Backend NestJS



Структура
auth/
users/
vendors/
categories/
reviews/
favorites/
requests/
weddings/
uploads/
admin/


Modules
Auth

Функції:

register
login
JWT
refresh token
roles
Users

Entity:

User

id
email
password
name
role

created_at
Vendors

Entity:

Vendor

id

user_id

name

description

category_id

city

price_from

rating

status
Categories
Category

id

name

slug

Приклад:

photo
venue
music
decor
beauty
Vendor Photos
VendorPhoto

id

vendor_id

url

order
Reviews
Review

id

vendor_id

user_id

rating

text
Favorites
Favorite

id

user_id

vendor_id
Requests

Lead.

Request

id

user_id

vendor_id


event_date

city

guests

budget

message


status

Status:

NEW
CONTACTED
DONE
CLOSED
Wedding
Wedding

id

user_id

date

city

guests

budget
Checklist
Task

id

wedding_id

title

completed

Default:

☐ Знайти ресторан
☐ Знайти фотографа
☐ Знайти DJ
☐ Замовити декор
5. API
Auth
POST
/api/auth/register


POST
/api/auth/login
Vendors

GET

/api/vendors

Query:

?category=photo
&city=kyiv
&price=50000

GET:

/api/vendors/:id

POST:

/api/vendors
Favorites

POST:

/api/favorites/:vendorId

GET:

/api/favorites
Requests

POST:

/api/requests

GET:

/api/vendor/requests
6. Database

PostgreSQL

ORM:

Prisma

Схема:

User
 |
 |
Wedding


User
 |
 |
Vendor
 |
 |
Category


Vendor
 |
 |
Photos


Vendor
 |
 |
Reviews


User
 |
 |
Favorites


Vendor
 |
 |
Requests
7. Admin MVP

Проста адмінка.

Можна навіть:

окремий route /admin

Функції:

Vendors
Pending:

Wedding Studio X

[Approve]
[Reject]
Categories

CRUD:

Photo
Venue
DJ
Decor