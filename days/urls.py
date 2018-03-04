from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('ddays/', views.ddays, name='ddays'),
    path('save', views.save, name='save')
]
