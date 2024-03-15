from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from sketches import views

router = routers.DefaultRouter()
router.register(r'sketches', views.SketchView, 'sketches')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Sketches API')),    
    path('api/v1/sketches/<int:pk>/get_generated_image/', views.SketchView.as_view({'get': 'get_generated_image'}), name='get_generated_image'),
    path('api/v1/sketches/<int:pk>/get_recognition_wheel3/', views.SketchView.as_view({'get': 'get_recognition_wheel3'}), name='get_recognition_wheel3'),
]