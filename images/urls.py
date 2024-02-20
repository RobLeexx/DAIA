from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from images import views

router = routers.DefaultRouter()
router.register(r'images', views.ImageView, 'images')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Images API')),
    path('api/v1/images/<int:pk>/get_recognition_wheel/', views.ImageView.as_view({'get': 'get_recognition_wheel'}), name='get_recognition_wheel'),
]