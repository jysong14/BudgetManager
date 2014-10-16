from django.conf.urls import patterns, url
from budget_manager import views
from budget_manager.views import IndexView, MainView, CalendarView, ProfileView

urlpatterns = patterns('',
	url(r'^$', IndexView.as_view(), name='index_view'), 
	url(r'^(?P<request_type>\w+)$', IndexView.as_view(), name='index_request'),
	url(r'^main/$', MainView.as_view(), name='main_view'),
	url(r'^main/(?P<request_type>\w+)$', MainView.as_view(), name='main_request'),
	url(r'^calendar/$', CalendarView.as_view(), name='calendar_view'),
	url(r'^profile/$', ProfileView.as_view(), name='profile_view'),
	url(r'^profile/(?P<request_type>\w+)$', ProfileView.as_view(), name='profile_request'),
);
