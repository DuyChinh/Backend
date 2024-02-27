# Flow Request

User request ==> Middleware ==> Route ==> Middleware ==> Requests ==> Controller

- Service => Model 
- Transformer

Rút gọn

Controller => Service (Model) => Transformer
Note: Service 
+ Nhận Request, dữ liệu từ controller
+ Không có response
+ Trả về dữ liệu

Ngoại lệ: Service có thể được gọi ở: Middleware, Request 
1 nghiệp tách ra 1 service (ví dụ)

## Repository Pattern

Controller => Service => Repository => Model
- create
- update
- findOne
- findAll

Vi du: đổi từ postgres --> MongoDB