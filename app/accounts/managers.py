from django.contrib.auth.base_user import BaseUserManager


class EmployeeManager(BaseUserManager):
    """
    Менеджер модели пользователя (для авторизации используется e-mail).
    """

    def create_user(self, email, password, **kwargs):
        if not email:
            raise ValueError('E-mail - обязательное поле.')
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **kwargs):
        kwargs.setdefault('is_staff', True)
        kwargs.setdefault('is_superuser', True)
        kwargs.setdefault('is_active', True)
        if kwargs.get('is_staff') is not True:
            raise ValueError('Для суперпользователя is_staff=True')
        if kwargs.get('is_superuser') is not True:
            raise ValueError('Для суперпользователя is_superuser=True.')
        if kwargs.get('is_active') is not True:
            raise ValueError('Для суперпользователя is_active=True.')
        return self.create_user(email, password, **kwargs)
