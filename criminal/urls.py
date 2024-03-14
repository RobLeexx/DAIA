from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from criminal import views

router = routers.DefaultRouter()
router.register(r'criminal', views.CriminalView, 'criminal')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Criminal API')),
    path('api/v1/criminal/<int:pk>/get_recognition_wheel2/', views.CriminalView.as_view({'get': 'get_recognition_wheel2'}), name='get_recognition_wheel2'),
]