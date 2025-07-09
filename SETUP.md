# Настройка API интеграции Pro-Tracker

## Запуск бэкенда

1. Перейдите в папку бэкенда:
```bash
cd pro-tracker-backend
```

2. Установите зависимости:
```bash
poetry install
```

3. Запустите PostgreSQL базу данных:
```bash
docker-compose up -d
```

4. Выполните миграции:
```bash
alembic upgrade head
```

5. Запустите сервер:
```bash
uvicorn main:main_app --reload --host 0.0.0.0 --port 8000
```

Бэкенд будет доступен по адресу: http://localhost:8000

## Запуск мобильного приложения

1. Перейдите в папку мобильного приложения:
```bash
cd pro-tracker-mobile
```

2. Установите зависимости:
```bash
yarn install
```

3. Запустите приложение:
```bash
yarn start
```

## Конфигурация API

Настройки API находятся в файле `config/env.ts`:

```typescript
const config: AppConfig = {
  API_BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://your-production-api.com',
  NODE_ENV: __DEV__ ? 'development' : 'production',
};
```

### Для локальной разработки:
- API_BASE_URL: `http://localhost:8000`
- Используйте код "1111" для быстрой авторизации

### Для production:
- Измените API_BASE_URL на ваш production URL
- Настройте реальную SMTP конфигурацию в бэкенде

## Тестирование авторизации

1. Запустите приложение
2. Введите любой номер телефона в формате +7 (XXX) XXX-XX-XX
3. Нажмите "Отправить код"
4. Введите код "1111" для локальной разработки
5. Приложение авторизует вас и перенаправит в главное меню

## API Endpoints

### Авторизация:
- `POST /api/v1/otp/send-code` - отправка OTP кода
- `POST /api/v1/otp/verify-code` - проверка OTP кода

### Товары:
- `GET /api/v1/products` - список товаров
- `POST /api/v1/products` - создание товара
- `GET /api/v1/products/categories/list` - список категорий

### Избранное:
- `GET /api/v1/favorites` - список избранного
- `POST /api/v1/favorites` - добавить в избранное
- `DELETE /api/v1/favorites/{product_id}` - удалить из избранного

## Возможные проблемы

### Ошибки подключения к API:
- Убедитесь, что бэкенд запущен на порту 8000
- Проверьте настройки CORS в main.py
- Для Android эмулятора используйте IP 10.0.2.2 вместо localhost

### Проблемы с базой данных:
- Убедитесь, что PostgreSQL запущен через docker-compose
- Проверьте, что миграции выполнены: `alembic upgrade head`

### Ошибки авторизации:
- Код "1111" работает только в development режиме
- Проверьте, что токен сохраняется в AsyncStorage 