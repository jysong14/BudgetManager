from django.conf.urls import include, url, patterns
from django.contrib import admin

admin.autodiscover();
urlpatterns = [
    url(r'^budget_manager/', include('budget_manager.urls', namespace='budget_manager')),
    url(r'^admin/', include(admin.site.urls)),
]
