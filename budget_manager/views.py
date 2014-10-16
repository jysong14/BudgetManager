from django.http import Http404
from django.http import HttpResponse, HttpResponseRedirect
from budget_manager.models import User, Budget, Summed_Budget, Card
from django.shortcuts import render, get_list_or_404, get_object_or_404, redirect
from django.views.generic.base import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from collections import OrderedDict
import json
import datetime

class jsonDateEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.date):
			return "{0}/{1}/{2}".format(obj.month, obj.day, obj.year);
		elif isinstance(obj, Budget):
			return [obj.date, obj.category, obj.description, obj.price];
		else:
			return super(jsonDateEncoder, self).default(obj);

class MainView(View):
	def get(self, request, *args, **kwargs):
		cards = Card.objects.filter(spender_id = request.user.id);
		return render(request, 'budget_manager/main.html', {'cards': cards});

	def post(self, request, *args, **kwargs):
		if(self.kwargs['request_type'] == 'pull'):
			summed_budgets = Summed_Budget.get_budgets(request);
			budgets = Budget.get_budgets(request);

			table_data = Budget.budget_to_array(budgets);
			pie_data = Summed_Budget.parse_pie_data(summed_budgets);
			line_data = Summed_Budget.parse_line_data(summed_budgets);

			graph_data = {'table_data': table_data, 'pie_data': pie_data, 'line_data': line_data};

			return HttpResponse(jsonDateEncoder().encode(graph_data), content_type='application/json');
		elif(self.kwargs['request_type'] == 'delete'):
			budget_stat = Budget.delete_budget(request);
			sum_stat = Summed_Budget.delete_budget(request);
			if((budget_stat == True) and (sum_stat == True)):
				msg = 'Delete Successful!';
			else:
				msg = 'Deletion Failed!';
			return HttpResponse(msg);
		else:
			return render(request, 'budget_manager/main.html', '');

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(MainView, self).dispatch(*args, **kwargs);

class IndexView(View):
	def get(self, request, *args, **kwargs):
		if('request_type' in self.kwargs):
			if(self.kwargs['request_type'] == 'logout'):
				logout(request);
				return render(request, 'budget_manager/index.html', '');
			else:
				return HttpResponse('Invalid Request!');
		else:
			return render(request, 'budget_manager/index.html', '');

	def post(self, request, *args, **kwargs):
		if(self.kwargs['request_type'] == 'signup'):
			if(User.objects.filter(username=request.POST['username']).exists()):
				return HttpResponse('User Already Exists!');
			else:
				username = request.POST['username'];
				password = request.POST['password'];
				email = request.POST['email'];
				User.objects.create_user(username, email, password);
				return HttpResponse('User Created!');
		elif(self.kwargs['request_type'] == 'login'):
			user = authenticate(username=request.POST['username'], password=request.POST['password']);
			if(user is not None):
				if(user.is_active):
					login(request, user);
					return redirect('/budget_manager/main/');
				else:
					return HttpResponse("User is Inactive!");
			else:
				return HttpResponse("User Not Found!");
		else:
			return HttpResponse("Invalid Request!");

class CalendarView(View):
	def get(self, request):
		cards = Card.objects.filter(spender_id = request.user.id);
		return render(request, 'budget_manager/calendar.html', {'cards':cards});

	def post(self, request):
		budget_stat = Budget.insert(request);
		sum_stat = Summed_Budget.insert(request);
		if((budget_stat == True) and (sum_stat == True)):
			msg = 'Insert Successful!';
		else:
			msg = 'Insertion Failed!'
		return HttpResponse(msg);

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(CalendarView, self).dispatch(*args, **kwargs);

class ProfileView(View):
	def get(self, request, *args, **kwargs):
		cards = Card.objects.filter(spender_id=request.user.id);
		return render(request, 'budget_manager/profile.html', {'cards': cards});

	def post(self, request, *args, **kwargs):
		if('request_type' in self.kwargs):
			if(self.kwargs['request_type'] == 'delete_card'):
				delete_stat = Card.delete_card(request);
				if(delete_stat == True):
					msg = 'Card Deleted!';
				else:
					msg = 'Failed to Delete Card!';
				return HttpResponse(msg);
			elif(self.kwargs['request_type'] == 'add_balance'):
				balance_stat = Card.add_balance(request);
				if(balance_stat == True):
					msg = 'Balance Added!';
				else:
					msg = 'Failed to Add Balance!';
				return HttpResponse(msg);
			elif(self.kwargs['request_type'] == 'add_card'):
				create_stat = Card.create_card(request);
				return HttpResponse(create_stat);
			else:
				return HttpResponse("Invalid Request!");
		else:
			create_stat = Card.create_card(request);
			return HttpResponse(create_stat);

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(ProfileView, self).dispatch(*args, **kwargs);