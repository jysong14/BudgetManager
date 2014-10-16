from django.db import models
from django.contrib.auth.models import User
from collections import OrderedDict
import datetime
import calendar

class Card(models.Model):
	number = models.IntegerField(max_length=4);
	category = models.CharField(max_length=6, blank=True, null=True);
	balance = models.FloatField(blank=True, null=True);
	spender = models.ForeignKey(User, blank=True, null=True);

	#Creates a card object and saves it in the database
	@classmethod
	def create_card(cls, request):
		card = Card.objects.filter(number=request.POST['card_number'], spender_id=request.user.id);
		if card:
			return "Card Already Exists!";
		else:
			user = User.objects.get(id=request.user.id);
			card_entry = Card();
			card_entry.number = request.POST['card_number'];
			card_entry.category = request.POST['card_type'];
			if(card_entry.category == 'Debit'):
				card_entry.balance = request.POST['card_balance'];
			card_entry.spender = user;
			card_entry.save();
			return "Card Created!";

	#Finds a card object and deletes it from the database
	@classmethod
	def delete_card(cls, request):
		card = cls.objects.get(number=request.POST['card_number'], spender_id=request.user.id);
		card.delete();
		return True;

	#Adds balance to the card object
	@classmethod
	def add_balance(cls, request):
		card = cls.objects.get(number=request.POST['card'], spender_id=request.user.id);
		card.balance += float(request.POST['balance']);
		card.save();
		return True;

class Budget(models.Model):
	category = models.CharField(max_length=20);
	description = models.CharField(max_length=20);
	date = models.DateField();
	price = models.FloatField();
	card = models.ForeignKey(Card, blank=True, null=True);

	@classmethod
	def insert(cls, request):
		card = Card.objects.get(spender_id=request.user.id, number=request.POST['card']);
		budget = Budget();
		budget.date = datetime.datetime.strptime(request.POST['date'], '%m/%d/%Y');
		budget.category = request.POST['category'];
		budget.description = request.POST['description'];
		budget.price = request.POST['amount'];
		budget.card = card;
		budget.save();
		return True;

	@classmethod
	def delete_budget(cls, request):
		date = request.POST['date'];
		category = request.POST['category'];
		description = request.POST['description'];
		price = request.POST['price'];
		bid = request.POST['bid'];
		del_budget = cls.objects.get(id=bid);
		del_budget.delete();
		return True;

	@classmethod
	def get_budgets(cls, request):
		card = Card.objects.get(spender_id=request.user.id, number=request.POST['card']);
		date_type = request.POST['date_type'];
		if(date_type == 'day'):
			date = datetime.date(int(request.POST['year_value']), int(request.POST['month_value']), int(request.POST['day_value']));
			budgets = cls.objects.filter(card_id=card.id, date=date);
		elif(date_type == 'month'):
			start_date = datetime.date(int(request.POST['year_value']), int(request.POST['month_value']), 1);
			end_of_month = calendar.monthrange(int(request.POST['year_value']), int(request.POST['month_value']))[1];
			end_date = datetime.date(int(request.POST['year_value']), int(request.POST['month_value']), end_of_month);
			budgets = cls.objects.filter(card_id=card.id, date__range=(start_date, end_date)).order_by('-date');
		elif(date_type == 'year'):
			start_date = datetime.date(int(request.POST['year_value']), 1, 1);
			end_date = datetime.date(int(request.POST['year_value']), 12, 31);
			budgets = cls.objects.filter(card_id=card.id, date__range=(start_date, end_date)).order_by('-date');
		return budgets;

	@staticmethod
	def budget_to_array(budget_list):
		output_list = [];
		entry = [];
		for budget in budget_list:
			entry.append(budget.date);
			entry.append(budget.category);
			entry.append(budget.description);
			entry.append(budget.price);
			entry.append(budget.id);
			entry.append(budget.card_id);
			output_list.append(entry);
			entry = [];
		return output_list;

class Summed_Budget(models.Model):
	category = models.CharField(max_length=20);
	date = models.DateField();
	price = models.FloatField();
	card = models.ForeignKey(Card, blank=True, null=True);

	@classmethod
	def insert(cls, request):
		card = Card.objects.get(spender_id=request.user.id, number=request.POST['card']);
		try:
			summed_budget = cls.objects.get(card_id=card.id, category=request.POST['category'], date=datetime.datetime.strptime(request.POST['date'], '%m/%d/%Y'));
		except cls.DoesNotExist:
			summed_budget = Summed_Budget();
			summed_budget.category = request.POST['category'];
			summed_budget.price = request.POST['amount'];
			summed_budget.date = datetime.datetime.strptime(request.POST['date'], '%m/%d/%Y');
			summed_budget.card = card;
			summed_budget.save();
		else:
			summed_budget.price = float(summed_budget.price) + float(request.POST['amount']);
			summed_budget.save();
		return True;

	@classmethod
	def delete_budget(cls, request):
		date = request.POST['date'];
		category = request.POST['category'];
		price = request.POST['price'];
		cid = request.POST['cid'];
		card = Card.objects.get(spender_id=request.user.id, id=cid);
		try:
			del_summed_budget = cls.objects.get(card_id=card.id, date=datetime.datetime.strptime(date, '%m/%d/%Y'), category=category);
		except cls.DoesNotExist:
			return HttpResponse('No Sum To Delete!');
		else:
			del_summed_budget.price = float(del_summed_budget.price) - float(price);
			if(del_summed_budget.price <= 0):
				del_summed_budget.delete();
			else:
				del_summed_budget.save();
		return True;

	@classmethod
	def get_budgets(cls, request):
		card = Card.objects.get(spender_id=request.user.id, number=request.POST['card']);
		date_type = request.POST['date_type'];
		if(date_type == 'day'):
			date = datetime.date(int(request.POST['year_value']), int(request.POST['month_value']), int(request.POST['day_value']));
			budgets = cls.objects.filter(card_id=card.id, date=date);
		elif(date_type == 'month'):
			start_date = datetime.date(int(request.POST['year_value']), int(request.POST['month_value']), 1);
			end_of_month = calendar.monthrange(int(request.POST['year_value']), int(request.POST['month_value']))[1];
			end_date = datetime.date(int(request.POST['year_value']), int(request.POST['month_value']), end_of_month);
			budgets = cls.objects.filter(card_id=card.id, date__range=(start_date, end_date)).order_by('date');
		elif(date_type == 'year'):
			start_date = datetime.date(int(request.POST['year_value']), 1, 1);
			end_date = datetime.date(int(request.POST['year_value']), 12, 31);
			budgets = cls.objects.filter(card_id=card.id, date__range=(start_date, end_date)).order_by('date');
		return budgets;

	@staticmethod
	def parse_pie_data(budget_list):
		price_array = [0, 0, 0, 0, 0, 0];

		for budget in budget_list:
			if(budget.category == "Clothing"):
				price_array[0] += budget.price;
			elif(budget.category == "Entertainment"):
				price_array[1] += budget.price;
			elif(budget.category == "Food"):
				price_array[2] += budget.price;
			elif(budget.category == "Housing"):
				price_array[3] += budget.price;
			elif(budget.category == "Medical"):
				price_array[4] += budget.price;
			else:
				price_array[5] += budget.price;
		
		index = 0;
		summed_price = [];
		cat_array = ["Clothing", "Entertainment", "Food", "Housing", "Medical", "Other"];

		for price in price_array:
			if(price != 0):
				summed_price.append([cat_array[index], price]);
			index+=1;

		return summed_price;

	@staticmethod
	def parse_line_data(budget_list):
		data_array = [[], [], [], [], [], []];

		for budget in budget_list:
			if(budget.category == "Clothing"):
				data_array[0].append([budget.date, budget.price]);
			elif(budget.category == "Entertainment"):
				data_array[1].append([budget.date, budget.price]);
			elif(budget.category == "Food"):
				data_array[2].append([budget.date, budget.price]);
			elif(budget.category == "Housing"):
				data_array[3].append([budget.date, budget.price]);
			elif(budget.category == "Medical"):
				data_array[4].append([budget.date, budget.price]);
			else:
				data_array[5].append([budget.date, budget.price]);

		index = 0;
		line_dict = OrderedDict();
		cat_array = ["Clothing", "Entertainment", "Food", "Housing", "Medical", "Other"];

		for data in data_array:
			if(len(data) != 0):
				line_dict.update({cat_array[index]: data});
			index+=1;
			
		return line_dict;
