from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.state import token_backend


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update(
            {
                'user': dict(
                    pk=self.user.pk,
                    full_name=self.user.full_name,
                    email=self.user.email,
                    role=self.user.role,
                )
            }
        )
        return data


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        decoded_payload = token_backend.decode(data['access'], verify=True)
        user_id = decoded_payload['user_id']
        user_model = get_user_model()
        user = user_model.objects.get(id=user_id)
        data.update(
            {
                'user': dict(
                    pk=user.pk,
                    full_name=user.full_name,
                    email=user.email,
                    role=user.role,
                )
            }
        )
        return data
