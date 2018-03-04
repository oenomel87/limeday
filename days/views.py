from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.core import serializers

from .models import Day

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
    response = {
        'result': 'SUCCESS'
    }
    return JsonResponse(response)
