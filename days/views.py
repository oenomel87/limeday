from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required

from .models import Day

@login_required
def index(request):
    days = Day.objects.filter(user=request.user).order_by('timestamp')
    context = {
        'days': days
    }
    return render(request, 'index.html', context)
