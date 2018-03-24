from datetime import date, datetime
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers

from .models import Day
from limeday.forms import UserForm

@login_required
def index(request):
    context = {
        'ddays': Day.objects.filter(user=request.user).order_by('timestamp')
    }
    return render(request, 'index.html', context)

@login_required
def ddays(request):
    data = {
        'result': 'SUCCESS',
        'ddays': serializers.serialize('json', Day.objects.filter(user=request.user).order_by('timestamp'))
    }
    return JsonResponse(data)

@login_required
def save(request):
    post = json.loads(request.body.decode('utf-8'))
    try:
        dday = setDDayData(post)
    except (KeyError):
        response = {
            'result': 'FAIL'
        }
    else:
        dday.save()
        response = {
            'result': 'SUCCESS'
        }
    return JsonResponse(response)

@login_required
def change_userdata(request):
    post = json.loads(request.body.decode('utf-8'))
    response = {}
    try:
        user = User.objects.get(username=request.user.username)
        user.set_password(post['password'])
        user.save()
        response['result'] = 'SUCCESS'
    except:
        response['result'] = 'FAIL'
    return JsonResponse(response)

def setDDayData(data):
    if data['pk'] == -1:
        print('new dday', str(data['pk']))
        dday = Day(day_name=data['day_name']
            , dday=datetime.strptime(data['dday'], '%Y-%m-%d'), user=request.user)
    else:
        print('update dday', str(data['pk']))
        dday = Day.objects.get(pk=data['pk'])
        dday.day_name = data['day_name']
        dday.dday = datetime.strptime(data['dday'], '%Y-%m-%d')
    return dday
